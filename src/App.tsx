import {
  Component,
  createResource,
  createSignal,
  Show,
  onMount,
} from 'solid-js';
import { GroupsDto, SearchResult } from './types';
import { api } from './rpc';
import SearchResults from './components/SearchResult';
import { SearchInput } from './components/SearchInput';
import ListOfGroups from './components/ListOfGroups';
import { useGroupBookmarks } from './hooks/useGroupBookmarks';
import GroupBookmarksList from './components/GroupBookmarksList';
import { SelectOptions } from './components/SelectOptions';
import { Button } from './components/ui/button';
import { FiPlus, FiSettings } from 'solid-icons/fi';
import { Toaster } from './components/ui/sonner';
import { useGroups } from './hooks/useGroups';
import { useWorkspace } from './hooks/useWorkspace';
import CreateBookmarkSheet from './components/CreateBookmarkSheet';
import CreateWorkspaceSheet from './components/CreateWorkspaceSheet';
import { useOrganization } from './hooks/useOrganization';
import Settings from './components/Settings';
import FirstTimeSetup from './components/FirstTimeSetup';

const App: Component = () => {
  const [isFirstTime, setIsFirstTime] = createSignal<boolean | null>(null); // null = loading, true = first time, false = has users
  const [currentUser, setCurrentUser] = createSignal<{
    id: number;
    name: string;
    email: string;
  } | null>(null);

  const [selectedGroup, setSelectedGroup] = createSignal<GroupsDto | null>(
    null
  );
  const [selectedWorkspaceId, setSelectedWorkspaceId] = createSignal<
    number | null
  >(null);
  const [results, setResults] = createSignal<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const [viewMode, setViewMode] = createSignal<
    'groups' | 'bookmarks' | 'search' | 'settings'
  >('groups');

  const {
    bookmarks: groupBookmarksList,
    clearSelection,
    error: bookmarksError,
    loading: bookmarksLoading,
    selectGroup,
  } = useGroupBookmarks();

  const {
    createGroup: createGroups,
    updateGroup: updateGroups,
    selectWorkspace: selectWorkspaceForGroups,
    deleteGroup,
    isCreating,
    isUpdating,
  } = useGroups();

  const {
    workspaces,
    createWorkspace,
    deleteWorkspace,
    updateWorkspace,
    isCreating: isCreatingWorkspace,
    isDeleting: isDeletingWorkspace,
    isUpdating: isUpdatingWorkspace,
  } = useWorkspace();

  const {
    selectOrganization,
    selectedOrganizationId,
    setSelectedUserId: setSelectedUserIdForOrg,
  } = useOrganization();

  const [groups, { refetch: refetchGroups }] = createResource(
    selectedWorkspaceId, // This is the source signal that will trigger refetch
    async (workspaceId) => {
      console.log('🔄 Fetching groups for workspace:', workspaceId);
      return await api.query(['groups.getBelongedGroups', workspaceId ?? 0]);
    }
  );

  // Check if there are existing users in the database on app load
  const [userCheck] = createResource(async () => {
    try {
      console.log('🔄 Checking for existing users...');
      const users = await api.query(['users.getUsers']);

      if (users && users.length > 0) {
        console.log('✅ Found existing users:', users.length);
        // Use the first user for now, or implement user selection logic
        const firstUser = users[0];
        setCurrentUser({
          id: firstUser.id,
          name: firstUser.name,
          email: firstUser.email,
        });

        // Also check and set the first organization if exists
        try {
          const organizations = await api.query([
            'organization.getOrganizations',
          ]);
          if (organizations && organizations.length > 0) {
            selectOrganization(organizations[0].id);
            console.log('✅ Auto-selected organization:', organizations[0].id);
          }
        } catch (orgError) {
          console.log('ℹ️ No organizations found, user can create one later');
        }

        setIsFirstTime(false);
        return { hasUsers: true, user: firstUser };
      } else {
        console.log('ℹ️ No users found, showing first-time setup');
        setIsFirstTime(true);
        console.log('✅ First-time setup needed');
        return { hasUsers: false, user: null };
      }
    } catch (error) {
      console.error('❌ Error checking users:', error);
      // If API call fails, assume first time setup is needed
      setIsFirstTime(true);
      return { hasUsers: false, user: null };
    }
  });

  const handleFirstTimeSetupComplete = (
    userId: number,
    organizationId: number
  ) => {
    console.log('✅ First-time setup completed', { userId, organizationId });

    // Set user info - we'll fetch the complete user data
    api
      .query(['users.getUserById', userId])
      .then((user) => {
        setCurrentUser({
          id: user.id,
          name: user.name,
          email: user.email,
        });
        console.log('✅ User data loaded:', user);
      })
      .catch((error) => {
        console.error('❌ Error loading user data:', error);
        // Fallback with minimal info
        setCurrentUser({ id: userId, name: '', email: '' });
      });

    setSelectedUserIdForOrg(userId);

    setIsFirstTime(false);
    // Auto select the created organization
    selectOrganization(organizationId);
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      setViewMode('groups');
      return;
    }

    const foundBookmarks = await api.query(['bookmark.search', query]);
    let searchResults: SearchResult[] = [];

    foundBookmarks.forEach((bookmark) => {
      searchResults.push({
        id: bookmark.id,
        title: bookmark.name,
        tags: bookmark.tags,
        is_favorite: bookmark.is_favorite,
        url: bookmark.url,
        type: 'bookmark',
      });
    });

    setResults(searchResults);
    setSelectedIndex(0); // Reset selection when new results come in
    setViewMode('search');
    setSelectedGroup(null); // Clear selected group when searching
  };

  const handleNavigate = (direction: 'up' | 'down') => {
    const resultsArray = results();
    if (resultsArray.length === 0) return;

    if (direction === 'down') {
      setSelectedIndex((prev) =>
        prev < resultsArray.length - 1 ? prev + 1 : 0
      );
    } else {
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : resultsArray.length - 1
      );
    }
  };

  const handleEnter = () => {
    const resultsArray = results();
    const selected = resultsArray[selectedIndex()];
    if (selected?.url) {
      // window.open(selected.url, '_blank');
      window.navigator.clipboard.writeText(selected.url);
    }
  };

  const handleGroupSelect = (group: GroupsDto) => {
    setSelectedGroup(group);
    selectGroup(group.id);
  };

  const handleCloseGroupBookmarks = () => {
    setSelectedGroup(null);
    clearSelection();
    setViewMode('groups');
  };

  const handleBookmarkSelect = (bookmark: SearchResult) => {
    if (bookmark.url) {
      // window.open(bookmark.url, '_blank');
      window.navigator.clipboard.writeText(bookmark.url);
    }
  };

  const handleWorkspaceSelect = (id: number) => {
    console.log('🏢 Selecting workspace:', id);
    setSelectedWorkspaceId(id);
    setSelectedGroup(null);
  };

  const handleRenameGroup = async ({ id, name }: GroupsDto) => {
    try {
      console.log('🔄 Renaming group:', id, name);

      const result = await updateGroups(id, name, selectedWorkspaceId() || 0);
      console.log('✅ Update result from backend:', result);

      // Add small delay before refetch to ensure backend is updated
      setTimeout(() => {
        console.log('🔄 Refetching groups...');
        refetchGroups();
      }, 100);
    } catch (error) {
      console.error('❌ Error renaming group:', error);
    }
  };

  const handleDeleteGroup = async (id: number) => {
    try {
      await deleteGroup(id);
      setSelectedGroup(null);
      refetchGroups();
    } catch (error) {
      console.error('❌ Error deleting group:', error);
    }
  };

  const handleCreateGroup = async () => {
    try {
      selectWorkspaceForGroups(selectedWorkspaceId() || 0);
      await createGroups();
      refetchGroups();
    } catch (error) {
      console.error('❌ Error creating group:', error);
    }
  };

  const handleCreateBookmark = async (
    name: string,
    url: string,
    selectedGroupId: number
  ) => {
    try {
      console.log('🔄 Creating new bookmark...', {
        name,
        url,
        selectedGroupId,
      });

      if (!selectedGroupId) {
        console.error('❌ No group selected');
        return;
      }

      const result = await api.mutation([
        'bookmark.create',
        {
          name,
          url,
          group_id: selectedGroupId || 0,
          is_favorite: false,
          tags: '',
        },
      ]);

      console.log('✅ Bookmark created:', result);

      // Refresh bookmarks jika sedang melihat group bookmarks
      if (selectedGroup()) {
        selectGroup(selectedGroup()!.id);
      }
    } catch (error) {
      console.error('❌ Error creating bookmark:', error);
    }
  };

  const handleCreateWorkspace = async (
    name: string,
    organizationId: number
  ) => {
    try {
      console.log('🔄 Creating new workspace...', { name, organizationId });

      const result = await createWorkspace(
        name,
        selectedOrganizationId() || organizationId
      );
      console.log('✅ Workspace created:', result);

      if (result?.id) {
        setSelectedWorkspaceId(result.id);
      }
    } catch (error) {
      console.error('❌ Error creating workspace:', error);
    }
  };

  const handleDeleteWorkspace = async (id: number) => {
    try {
      await deleteWorkspace(id);

      // Reset selected workspace if deleted workspace was being selected
      if (selectedWorkspaceId() === id) {
        // Select first available workspace or set to 0
        const remainingWorkspaces = workspaces()?.filter((ws) => ws.id !== id);
        if (remainingWorkspaces && remainingWorkspaces.length > 0) {
          setSelectedWorkspaceId(remainingWorkspaces[0].id);
        } else {
          setSelectedWorkspaceId(0);
        }
      }

      refetchGroups();
    } catch (error) {
      console.error('❌ Error deleting workspace:', error);
    }
  };

  onMount(() => {
    userCheck();
  });

  return (
    <Show
      when={!isFirstTime()}
      fallback={<FirstTimeSetup onComplete={handleFirstTimeSetupComplete} />}
    >
      <div class="h-screen bg-black flex flex-col overflow-hidden">
        {/* Header Section - Fixed */}
        <div>
          <SearchInput
            onSearch={handleSearch}
            onNavigate={handleNavigate}
            onEnter={handleEnter}
          />

          <div class="flex absolute right-20 top-0 mt-2">
            <SelectOptions
              placeholder="Select Workspace"
              options={
                workspaces()?.map((ws) => ({
                  name: ws.name,
                  id: ws.id,
                })) || []
              }
              onSelect={handleWorkspaceSelect}
              selectedId={selectedWorkspaceId() ?? 0}
            />
            <CreateWorkspaceSheet onSubmit={handleCreateWorkspace} />
          </div>
        </div>

        {/* Main Content - Flexible */}
        <div class="flex flex-1 min-h-0">
          {/* Sidebar - Fixed width, no scroll */}
          <div class="px-8 py-8 bg-gray-500/10 flex flex-col min-h-0 h-full">
            <div>
              {/* New group button */}
              <div class="pb-5 px-2 shrink-0">
                <Button
                  variant={'ghost'}
                  class="text-white/80 hover:bg-gray-500/10 hover:text-white w-full justify-start cursor-pointer"
                  onclick={handleCreateGroup}
                  disabled={isCreating() || isUpdating()}
                >
                  <FiPlus />
                  {isCreating() ? ' Creating...' : 'New Group'}
                </Button>
              </div>

              {/* Groups Section */}
              <div class="flex flex-col">
                <ListOfGroups
                  groups={groups()}
                  loading={groups.loading}
                  error={groups.error}
                  onGroupSelect={handleGroupSelect}
                  selectedGroupId={selectedGroup()?.id || 0}
                  onRenameGroup={handleRenameGroup}
                  onDeleteGroup={handleDeleteGroup}
                />
              </div>
            </div>
          </div>

          {/* Main Content Area - Scrollable */}
          <div class="flex-1 p-3 overflow-y-auto">
            <Show when={selectedWorkspaceId()}>
              <CreateBookmarkSheet
                onSubmit={handleCreateBookmark}
                options={
                  groups()?.map((group) => ({
                    id: group.id,
                    name: group.name,
                  })) ?? []
                }
                selectedGroupId={selectedGroup()?.id}
              />
            </Show>
            {/* Search Results Section */}
            <Show when={viewMode() === 'search'}>
              <SearchResults
                results={results()}
                selectedIndex={selectedIndex()}
                onSelectionChange={setSelectedIndex}
                onSelectItem={handleBookmarkSelect}
              />
            </Show>

            {/* Group Bookmarks Section */}
            <Show when={selectedGroup()}>
              <GroupBookmarksList
                group={selectedGroup()}
                bookmarks={groupBookmarksList()}
                loading={bookmarksLoading}
                error={bookmarksError}
                onClose={handleCloseGroupBookmarks}
                onBookmarkSelect={handleBookmarkSelect}
              />
            </Show>

            {/* Settings Section */}
            <Show when={viewMode() === 'settings'}>
              <div class="text-white">
                <Settings
                  selectedWorkspaceId={selectedWorkspaceId}
                  onWorkspaceSelect={handleWorkspaceSelect}
                  onDeleteWorkspace={handleDeleteWorkspace}
                  onClose={() => setViewMode('groups')} // Kembali ke groups view
                />
              </div>
            </Show>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div class="fixed bottom-4 right-4 text-xs text-gray-500">
          <Button
            class="fixed bottom-10 right-4 cursor-pointer"
            onclick={() =>
              setViewMode(viewMode() === 'settings' ? 'groups' : 'settings')
            }
          >
            <FiSettings />
          </Button>
          <div>↑↓ Navigate • Enter Open • Esc Clear</div>
        </div>

        <Toaster theme="dark" />
      </div>
    </Show>
  );
};

export default App;
// import { Component, createResource, createSignal, Show } from 'solid-js';
// import { GroupsDto, SearchResult } from './types';
// import { api } from './rpc';
// import SearchResults from './components/SearchResult';
// import { SearchInput } from './components/SearchInput';
// import ListOfGroups from './components/ListOfGroups';
// import { useGroupBookmarks } from './hooks/useGroupBookmarks';
// import GroupBookmarksList from './components/GroupBookmarksList';
// import { SelectOptions } from './components/SelectOptions';
// import { Button } from './components/ui/button';
// import { FiPlus, FiSettings } from 'solid-icons/fi';
// import { Toaster } from './components/ui/sonner';
// import { useGroups } from './hooks/useGroups';
// import { useWorkspace } from './hooks/useWorkspace';
// import CreateBookmarkSheet from './components/CreateBookmarkSheet';
// import CreateWorkspaceSheet from './components/CreateWorkspaceSheet';
// import { useOrganization } from './hooks/useOrganization';
// import Settings from './components/Settings';
// import FirstTimeSetup from './components/FirstTimeSetup';

// const App: Component = () => {
//   const [isFirstTime, setIsFirstTime] = createSignal(true);
//   const [currentUser, setCurrentUser] = createSignal<{
//     id: number;
//     name: string;
//   } | null>(null);

//   const [selectedGroup, setSelectedGroup] = createSignal<GroupsDto | null>(
//     null
//   );
//   const [selectedWorkspaceId, setSelectedWorkspaceId] = createSignal<
//     number | null
//   >(null);
//   const [results, setResults] = createSignal<SearchResult[]>([]);
//   const [selectedIndex, setSelectedIndex] = createSignal(0);
//   const [viewMode, setViewMode] = createSignal<
//     'groups' | 'bookmarks' | 'search' | 'settings'
//   >('groups');

//   const {
//     bookmarks: groupBookmarksList,
//     clearSelection,
//     error: bookmarksError,
//     loading: bookmarksLoading,
//     selectGroup,
//   } = useGroupBookmarks();

//   const {
//     createGroup: createGroups,
//     updateGroup: updateGroups,
//     selectWorkspace: selectWorkspaceForGroups,
//     deleteGroup,
//     isCreating,
//     isUpdating,
//   } = useGroups();

//   const {
//     workspaces,
//     createWorkspace,
//     deleteWorkspace,
//     updateWorkspace,
//     isCreating: isCreatingWorkspace,
//     isDeleting: isDeletingWorkspace,
//     isUpdating: isUpdatingWorkspace,
//   } = useWorkspace();

//   const { selectOrganization } = useOrganization();

//   const [groups, { refetch: refetchGroups }] = createResource(
//     selectedWorkspaceId, // This is the source signal that will trigger refetch
//     async (workspaceId) => {
//       console.log('🔄 Fetching groups for workspace:', workspaceId);
//       return await api.query(['groups.getBelongedGroups', workspaceId ?? 0]);
//     }
//   );

//   const handleFirstTimeSetupComplete = (
//     userId: number,
//     organizationId: number
//   ) => {
//     setCurrentUser({ id: userId, name: '' }); // Set user info
//     setIsFirstTime(false);
//     // Auto select the created organization
//     selectOrganization(organizationId); // Call from useOrganization hook
//   };

//   const handleSearch = async (query: string) => {
//     if (!query.trim()) {
//       setResults([]);
//       setSelectedIndex(0);
//       setViewMode('groups');
//       return;
//     }

//     const foundBookmarks = await api.query(['bookmark.search', query]);
//     let searchResults: SearchResult[] = [];

//     foundBookmarks.forEach((bookmark) => {
//       searchResults.push({
//         id: bookmark.id,
//         title: bookmark.name,
//         tags: bookmark.tags,
//         is_favorite: bookmark.is_favorite,
//         url: bookmark.url,
//         type: 'bookmark',
//       });
//     });

//     setResults(searchResults);
//     setSelectedIndex(0); // Reset selection when new results come in
//     setViewMode('search');
//     setSelectedGroup(null); // Clear selected group when searching
//   };

//   const handleNavigate = (direction: 'up' | 'down') => {
//     const resultsArray = results();
//     if (resultsArray.length === 0) return;

//     if (direction === 'down') {
//       setSelectedIndex((prev) =>
//         prev < resultsArray.length - 1 ? prev + 1 : 0
//       );
//     } else {
//       setSelectedIndex((prev) =>
//         prev > 0 ? prev - 1 : resultsArray.length - 1
//       );
//     }
//   };

//   const handleEnter = () => {
//     const resultsArray = results();
//     const selected = resultsArray[selectedIndex()];
//     if (selected?.url) {
//       // window.open(selected.url, '_blank');
//       window.navigator.clipboard.writeText(selected.url);
//     }
//   };

//   const handleGroupSelect = (group: GroupsDto) => {
//     setSelectedGroup(group);
//     selectGroup(group.id);
//   };

//   const handleCloseGroupBookmarks = () => {
//     setSelectedGroup(null);
//     clearSelection();
//     setViewMode('groups');
//   };

//   const handleBookmarkSelect = (bookmark: SearchResult) => {
//     if (bookmark.url) {
//       // window.open(bookmark.url, '_blank');
//       window.navigator.clipboard.writeText(bookmark.url);
//     }
//   };

//   const handleWorkspaceSelect = (id: number) => {
//     console.log('🏢 Selecting workspace:', id);
//     setSelectedWorkspaceId(id);
//     setSelectedGroup(null);
//   };

//   const handleRenameGroup = async ({ id, name }: GroupsDto) => {
//     try {
//       console.log('🔄 Renaming group:', id, name);

//       const result = await updateGroups(id, name, selectedWorkspaceId() || 0);
//       console.log('✅ Update result from backend:', result);

//       // Add small delay before refetch to ensure backend is updated
//       setTimeout(() => {
//         console.log('🔄 Refetching groups...');
//         refetchGroups();
//       }, 100);
//     } catch (error) {
//       console.error('❌ Error renaming group:', error);
//     }
//   };

//   const handleDeleteGroup = async (id: number) => {
//     try {
//       await deleteGroup(id);
//       setSelectedGroup(null);
//       refetchGroups();
//     } catch (error) {
//       console.error('❌ Error deleting group:', error);
//     }
//   };

//   const handleCreateGroup = async () => {
//     try {
//       selectWorkspaceForGroups(selectedWorkspaceId() || 0);
//       await createGroups();
//       refetchGroups();
//     } catch (error) {
//       console.error('❌ Error creating group:', error);
//     }
//   };

//   const handleCreateBookmark = async (
//     name: string,
//     url: string,
//     selectedGroupId: number
//   ) => {
//     try {
//       console.log('🔄 Creating new bookmark...', {
//         name,
//         url,
//         selectedGroupId,
//       });

//       if (!selectedGroupId) {
//         console.error('❌ No group selected');
//         return;
//       }

//       const result = await api.mutation([
//         'bookmark.create',
//         {
//           name,
//           url,
//           group_id: selectedGroupId || 0,
//           is_favorite: false,
//           tags: '',
//         },
//       ]);

//       console.log('✅ Bookmark created:', result);

//       // Refresh bookmarks jika sedang melihat group bookmarks
//       if (selectedGroup()) {
//         selectGroup(selectedGroup()!.id);
//       }
//     } catch (error) {
//       console.error('❌ Error creating bookmark:', error);
//     }
//   };

//   const handleCreateWorkspace = async (
//     name: string,
//     organizationId: number
//   ) => {
//     try {
//       console.log('🔄 Creating new workspace...', { name, organizationId });

//       const result = await createWorkspace(name, 1);
//       console.log('✅ Workspace created:', result);

//       if (result?.id) {
//         setSelectedWorkspaceId(result.id);
//       }
//     } catch (error) {
//       console.error('❌ Error creating workspace:', error);
//     }
//   };

//   const handleDeleteWorkspace = async (id: number) => {
//     try {
//       await deleteWorkspace(id);

//       // Reset selected workspace if deleted workspace was being selected
//       if (selectedWorkspaceId() === id) {
//         // Select first available workspace or set to 0
//         const remainingWorkspaces = workspaces()?.filter((ws) => ws.id !== id);
//         if (remainingWorkspaces && remainingWorkspaces.length > 0) {
//           setSelectedWorkspaceId(remainingWorkspaces[0].id);
//         } else {
//           setSelectedWorkspaceId(0);
//         }
//       }

//       refetchGroups();
//     } catch (error) {
//       console.error('❌ Error deleting workspace:', error);
//     }
//   };

//   return (
//     <Show
//       when={!isFirstTime()}
//       fallback={<FirstTimeSetup onComplete={handleFirstTimeSetupComplete} />}
//     >
//       <div class="h-screen bg-black flex flex-col overflow-hidden">
//         {/* Header Section - Fixed */}
//         <div>
//           <SearchInput
//             onSearch={handleSearch}
//             onNavigate={handleNavigate}
//             onEnter={handleEnter}
//           />

//           <div class="flex absolute right-20 top-0 mt-2">
//             <SelectOptions
//               placeholder="Select Workspace"
//               options={
//                 workspaces()?.map((ws) => ({
//                   name: ws.name,
//                   id: ws.id,
//                 })) || []
//               }
//               onSelect={handleWorkspaceSelect}
//               selectedId={selectedWorkspaceId() ?? 0}
//             />
//             <CreateWorkspaceSheet onSubmit={handleCreateWorkspace} />
//           </div>
//         </div>

//         {/* Main Content - Flexible */}
//         <div class="flex flex-1 min-h-0">
//           {/* Sidebar - Fixed width, no scroll */}
//           <div class="px-8 py-8 bg-gray-500/10 flex flex-col min-h-0 h-full">
//             <div>
//               {/* New group button */}
//               <div class="pb-5 px-2 shrink-0">
//                 <Button
//                   variant={'ghost'}
//                   class="text-white/80 hover:bg-gray-500/10 hover:text-white w-full justify-start cursor-pointer"
//                   onclick={handleCreateGroup}
//                   disabled={isCreating() || isUpdating()}
//                 >
//                   <FiPlus />
//                   {isCreating() ? ' Creating...' : 'New Group'}
//                 </Button>
//               </div>

//               {/* Groups Section */}
//               <div class="flex flex-col">
//                 <ListOfGroups
//                   groups={groups()}
//                   loading={groups.loading}
//                   error={groups.error}
//                   onGroupSelect={handleGroupSelect}
//                   selectedGroupId={selectedGroup()?.id || 0}
//                   onRenameGroup={handleRenameGroup}
//                   onDeleteGroup={handleDeleteGroup}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Main Content Area - Scrollable */}
//           <div class="flex-1 p-3 overflow-y-auto">
//             <Show when={selectedWorkspaceId()}>
//               <CreateBookmarkSheet
//                 onSubmit={handleCreateBookmark}
//                 options={
//                   groups()?.map((group) => ({
//                     id: group.id,
//                     name: group.name,
//                   })) ?? []
//                 }
//                 selectedGroupId={selectedGroup()?.id}
//               />
//             </Show>
//             {/* Search Results Section */}
//             <Show when={viewMode() === 'search'}>
//               <SearchResults
//                 results={results()}
//                 selectedIndex={selectedIndex()}
//                 onSelectionChange={setSelectedIndex}
//                 onSelectItem={handleBookmarkSelect}
//               />
//             </Show>

//             {/* Group Bookmarks Section */}
//             <Show when={selectedGroup()}>
//               <GroupBookmarksList
//                 group={selectedGroup()}
//                 bookmarks={groupBookmarksList()}
//                 loading={bookmarksLoading}
//                 error={bookmarksError}
//                 onClose={handleCloseGroupBookmarks}
//                 onBookmarkSelect={handleBookmarkSelect}
//               />
//             </Show>

//             {/* Settings Section */}
//             <Show when={viewMode() === 'settings'}>
//               <div class="text-white">
//                 <Settings
//                   selectedWorkspaceId={selectedWorkspaceId}
//                   onWorkspaceSelect={handleWorkspaceSelect}
//                   onDeleteWorkspace={handleDeleteWorkspace}
//                   onClose={() => setViewMode('groups')} // Kembali ke groups view
//                 />
//               </div>
//             </Show>
//           </div>
//         </div>

//         {/* Footer - Fixed */}
//         <div class="fixed bottom-4 right-4 text-xs text-gray-500">
//           <Button
//             class="fixed bottom-10 right-4 cursor-pointer"
//             onclick={() =>
//               setViewMode(viewMode() === 'settings' ? 'groups' : 'settings')
//             }
//           >
//             <FiSettings />
//           </Button>
//           <div>↑↓ Navigate • Enter Open • Esc Clear</div>
//         </div>

//         <Toaster theme="dark" />
//       </div>
//     </Show>
//   );
// };

// export default App;
