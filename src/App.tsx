import {
  Component,
  createResource,
  createSignal,
  Show,
  onMount,
  createEffect,
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
  const [isFirstTime, setIsFirstTime] = createSignal<boolean | null>(null);
  const [currentUser, setCurrentUser] = createSignal<{
    id: number;
    name: string;
    email: string;
  } | null>(null);

  const [selectedGroup, setSelectedGroup] = createSignal<GroupsDto | null>(
    null
  );
  // const [selectedWorkspaceId, setSelectedWorkspaceId] = createSignal<
  //   number | null
  // >(null);
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
    setSelectedOrgId: setSelectedOrgIdForWorkspace,
    isCreating: isCreatingWorkspace,
    isDeleting: isDeletingWorkspace,
    isUpdating: isUpdatingWorkspace,
    refetchWorkspaces,
    selectedWorkspaceId,
    setSelectedWorkspaceId,
  } = useWorkspace();

  const {
    selectOrganization,
    selectedOrganizationId,
    setSelectedUserId: setSelectedUserIdForOrg,
    organizations,
  } = useOrganization();

  // Auto-select first organization when organizations are loaded
  createEffect(() => {
    const orgList = organizations();
    const currentOrgId = selectedOrganizationId();

    if (orgList && orgList.length > 0 && !currentOrgId) {
      const firstOrg = orgList[0];
      console.log(
        '✅ Auto-selecting first organization:',
        firstOrg.id,
        firstOrg.name
      );
      selectOrganization(firstOrg.id);
    }
  });

  // Unified effect untuk handle organization changes
  createEffect(() => {
    const orgId = selectedOrganizationId();
    console.log('🔄 Organization changed:', orgId);

    if (orgId) {
      // Set organization ID for workspace hook
      setSelectedOrgIdForWorkspace(orgId);

      // Reset selected workspace and groups when organization changes
      setSelectedWorkspaceId(null);
      setSelectedGroup(null);
      clearSelection();

      // Refetch workspaces for new organization
      refetchWorkspaces();
    }
  });

  // Auto-select first workspace when workspaces are loaded
  createEffect(() => {
    const workspaceList = workspaces();
    const currentWorkspaceId = selectedWorkspaceId();
    const currentOrgId = selectedOrganizationId();

    console.log('🔄 Workspaces effect:', {
      workspaceList: workspaceList?.length || 0,
      currentWorkspaceId,
      currentOrgId,
    });

    // Only auto-select if we have workspaces, no current selection, and we have an org
    if (
      workspaceList &&
      workspaceList.length > 0 &&
      !currentWorkspaceId &&
      currentOrgId
    ) {
      const firstWorkspace = workspaceList[0];
      console.log('✅ Auto-selecting first workspace:', firstWorkspace.name);
      setSelectedWorkspaceId(firstWorkspace.id);
    }
  });

  const [groups, { refetch: refetchGroups }] = createResource(
    () => ({
      workspaceId: selectedWorkspaceId(),
      organizationId: selectedOrganizationId(),
    }),
    async (deps) => {
      const { workspaceId, organizationId } = deps;

      if (!organizationId || !workspaceId) {
        console.log(
          '🔄 No organization or workspace selected, returning empty groups'
        );
        return [];
      }

      console.log(
        '🔄 Fetching groups for workspace:',
        workspaceId,
        'in org:',
        organizationId
      );

      try {
        return await api.query(['groups.getBelongedGroups', workspaceId]);
      } catch (error) {
        console.error('❌ Error fetching groups:', error);
        return [];
      }
    }
  );

  // Check if there are existing users in the database on app load
  const [userCheck] = createResource(async () => {
    try {
      console.log('🔄 Checking for existing users...');
      const users = await api.query(['users.getUsers']);

      if (users && users.length > 0) {
        console.log('✅ Found existing users:', users.length);
        const firstUser = users[0];
        setCurrentUser({
          id: firstUser.id,
          name: firstUser.name,
          email: firstUser.email,
        });

        // Set user ID to trigger organizations fetch
        setSelectedUserIdForOrg(firstUser.id);

        setIsFirstTime(false);
        return { hasUsers: true, user: firstUser };
      } else {
        console.log('ℹ️ No users found, showing first-time setup');
        setIsFirstTime(true);
        return { hasUsers: false, user: null };
      }
    } catch (error) {
      console.error('❌ Error checking users:', error);
      setIsFirstTime(true);
      return { hasUsers: false, user: null };
    }
  });

  const handleFirstTimeSetupComplete = (
    userId: number,
    organizationId: number
  ) => {
    console.log('✅ First-time setup completed', { userId, organizationId });

    // Set user info
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
      handleViewModeChange('groups');
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
    setSelectedIndex(0);
    handleViewModeChange('search');
    setSelectedGroup(null);
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
      window.navigator.clipboard.writeText(selected.url);
    }
  };

  const handleGroupSelect = (group: GroupsDto) => {
    setSelectedGroup(group);
    selectGroup(group.id);

    if (viewMode() === 'settings') {
      handleViewModeChange('groups');
    }
  };

  const handleCloseGroupBookmarks = () => {
    setSelectedGroup(null);
    clearSelection();
    handleViewModeChange('groups');
  };

  const handleBookmarkSelect = (bookmark: SearchResult) => {
    if (bookmark.url) {
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

      if (selectedWorkspaceId() === id) {
        const remainingWorkspaces = workspaces()?.filter((ws) => ws.id !== id);
        if (remainingWorkspaces && remainingWorkspaces.length > 0) {
          setSelectedWorkspaceId(remainingWorkspaces[0].id);
        } else {
          setSelectedWorkspaceId(null);
        }
      }

      refetchGroups();
    } catch (error) {
      console.error('❌ Error deleting workspace:', error);
    }
  };

  const handleViewModeChange = (
    newMode: 'groups' | 'bookmarks' | 'search' | 'settings'
  ) => {
    // Cleanup logic berdasarkan mode yang akan dibuka
    switch (newMode) {
      case 'settings':
        // Tutup group bookmarks jika sedang aktif
        setSelectedGroup(null);
        clearSelection();
        break;

      case 'groups':
        // Tutup search results jika ada
        setResults([]);
        setSelectedIndex(0);
        break;

      case 'search':
        // Tutup group bookmarks jika sedang aktif
        setSelectedGroup(null);
        clearSelection();
        break;
    }

    setViewMode(newMode);
  };

  onMount(() => {
    console.log('🔄 App mounted, checking for first-time setup...');
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
            {/**
             * Workspace Selector
             */}
            <SelectOptions
              placeholder={
                workspaces.loading
                  ? 'Loading workspaces...'
                  : 'Select Workspace'
              }
              options={
                workspaces()?.map((ws) => ({
                  name: ws.name,
                  id: ws.id,
                })) || []
              }
              onSelect={handleWorkspaceSelect}
              selectedId={selectedWorkspaceId() ?? 0}
              class="mr-2"
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
            {/* deprecated create bookmark sheet */}
            {/* <Show when={selectedWorkspaceId()}>
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
            </Show> */}

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
              <div class="space-y-4">
                {/* Create Bookmark Button - di dalam group view */}
                <div class="flex justify-between items-center">
                  <h2 class="text-xl font-semibold text-white">
                    {selectedGroup()?.name} Bookmarks
                  </h2>
                  <CreateBookmarkSheet
                    onSubmit={handleCreateBookmark}
                    options={[
                      { id: selectedGroup()!.id, name: selectedGroup()!.name },
                    ]}
                    selectedGroupId={selectedGroup()?.id}
                  />
                </div>
                <GroupBookmarksList
                  group={selectedGroup()}
                  bookmarks={groupBookmarksList()}
                  loading={bookmarksLoading}
                  error={bookmarksError}
                  onClose={handleCloseGroupBookmarks}
                  onBookmarkSelect={handleBookmarkSelect}
                />
              </div>
            </Show>

            {/* Settings Section */}
            <Show when={viewMode() === 'settings'}>
              <div class="text-white">
                <Settings
                  workspaces={workspaces() ?? []}
                  organizations={organizations() ?? []}
                  organizationId={selectedOrganizationId() || 0}
                  selectedWorkspaceId={selectedWorkspaceId}
                  onWorkspaceSelect={handleWorkspaceSelect}
                  onDeleteWorkspace={handleDeleteWorkspace}
                  onClose={() => setViewMode('groups')}
                  // Tambah organization handlers
                  onCreateOrganization={async (name: string) => {
                    try {
                      // Assuming user ID is always 1
                      const userId = currentUser()?.id || 1;
                      return await api.mutation([
                        'organization.createOrganization',
                        { name, user_id: userId },
                      ]);
                    } catch (error) {
                      console.error('Failed to create organization:', error);
                      throw error;
                    }
                  }}
                  onUpdateOrganization={async (id: number, name: string) => {
                    try {
                      const userId = currentUser()?.id || 1;
                      return await api.mutation([
                        'organization.updateOrganization',
                        { id, name, user_id: userId },
                      ]);
                    } catch (error) {
                      console.error('Failed to update organization:', error);
                      throw error;
                    }
                  }}
                  onDeleteOrganization={async (id: number) => {
                    try {
                      return await api.mutation([
                        'organization.deleteOrganization',
                        id,
                      ]);
                    } catch (error) {
                      console.error('Failed to delete organization:', error);
                      throw error;
                    }
                  }}
                  onSelectOrganization={selectOrganization}
                  isCreatingOrg={false} // Anda bisa menambahkan loading state jika diperlukan
                  isUpdatingOrg={false}
                  isDeletingOrg={false}
                />
              </div>
            </Show>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div class="fixed bottom-4 right-4 text-xs text-gray-500">
          <Button
            class="fixed bottom-10 right-4 cursor-pointer"
            onclick={() => {
              const newMode = viewMode() === 'settings' ? 'groups' : 'settings';
              handleViewModeChange(newMode);
            }}
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
