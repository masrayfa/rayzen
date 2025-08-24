import {
  Component,
  createResource,
  createSignal,
  Show,
  onMount,
  createEffect,
} from 'solid-js';
import { GroupsDto, SearchResult, UserDto } from './types';
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
import NoGroupsFound from './components/NoGroupsFound';

const App: Component = () => {
  const [isFirstTime, setIsFirstTime] = createSignal<boolean | null>(null);
  const [isFirstTimeForOrg, setIsFirstTimeForOrg] = createSignal<
    boolean | null
  >(null);
  const [currentUser, setCurrentUser] = createSignal<{
    id: number;
    name: string;
    email: string;
  } | null>(null);

  const [results, setResults] = createSignal<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const [viewMode, setViewMode] = createSignal<
    'groups' | 'bookmarks' | 'search' | 'settings'
  >('groups');

  const {
    bookmarks: groupBookmarksList,
    createBookmark,
    clearSelection,
    error: bookmarksError,
    loading: bookmarksLoading,
    selectGroup,
  } = useGroupBookmarks();

  // Updated: Use the enhanced useGroups hook
  const {
    groups,
    loading: groupsLoading,
    error: groupsError,
    selectedGroup,
    setSelectedGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    selectWorkspace: selectWorkspaceForGroups,
    selectOrganization: selectOrganizationForGroups,
    isCreating,
    isUpdating,
    refetchGroups,
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
    deleteOrganization,
    updateOrganization,
    createOrganization,
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
      // 1. Set organization ID for workspace hook
      setSelectedOrgIdForWorkspace(orgId);

      // 2. Set organization ID for groups hook
      selectOrganizationForGroups(orgId);

      // 3. 🔥 CRITICAL: Reset selected workspace when organization changes
      console.log('🔄 Resetting workspace selection due to org change');
      setSelectedWorkspaceId(null);

      // 4. Reset selected group and clear bookmarks
      setSelectedGroup(null);
      clearSelection();

      // 5. 🔥 CRITICAL: Clear groups immediately untuk organization baru
      console.log('🔄 Clearing groups for organization change');
      // Groups akan ter-trigger untuk re-fetch dengan workspace null,
      // yang akan menghasilkan empty groups

      selectWorkspaceForGroups(null);

      // 6. Refetch workspaces for new organization
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

  // Effect for sync workspace selection to groups hook
  createEffect(() => {
    const workspaceId = selectedWorkspaceId();
    const orgId = selectedOrganizationId();

    console.log('🔄 Syncing workspace to groups hook:', { workspaceId, orgId });

    // Always sync workspace to groups, even if null
    // when workspaceId null, groups hook will return empty groups
    if (orgId) {
      // Only sync if we have organization
      selectWorkspaceForGroups(workspaceId);
    }
  });

  // Check if there are existing users in the database on app load
  const [initializationData] = createResource(async () => {
    try {
      console.log('🔄 Checking for existing users...');
      const users = await api.query(['users.getUsers']);

      if (!users || users.length === 0) {
        console.log('ℹ️ No users found, showing first-time setup');
        setIsFirstTime(true);
        setIsFirstTimeForOrg(null); // ✅ Set null, bukan true
        setCurrentUser(null); // ✅ Explicitly set null
        return { hasUsers: false, user: null };
      }

      // Take first user since it only allows to have 1 user atm
      const firstUser = users[0];
      console.log('✅ Found existing users:', users.length);

      setCurrentUser({
        id: firstUser.id,
        name: firstUser.name,
        email: firstUser.email,
      });

      console.log('@app::createReesource::checking user-data: ', currentUser());

      const userOrganizations = await api.query([
        'organization.getOrganizationByUserId',
        firstUser.id,
      ]);

      const hasOrganizations =
        userOrganizations && userOrganizations.length > 0;

      if (!hasOrganizations) {
        console.log('❌ User has no organization, need to create one');
        setIsFirstTime(false); // User already exists
        setIsFirstTimeForOrg(true); // But need org setup
        return {
          hasUsers: true,
          hasOrg: false,
          user: firstUser,
        };
      }

      // User exists and has organization - normal flow
      console.log('✅ User has organizations:', userOrganizations.length);
      setSelectedUserIdForOrg(firstUser.id);
      setIsFirstTime(false);
      setIsFirstTimeForOrg(false);

      return {
        hasUsers: true,
        hasOrg: true,
        user: firstUser,
      };
    } catch (error) {
      console.error('❌ Error checking users:', error);
      setIsFirstTime(true);
      setIsFirstTimeForOrg(null); // ✅ Set null for true first time
      setCurrentUser(null);
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

    setIsFirstTime(false);
    setIsFirstTimeForOrg(false);

    setSelectedUserIdForOrg(userId);

    selectOrganization(organizationId);

    console.log('✅ First time setup handler finished');
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
      await updateGroup(id, name, selectedWorkspaceId() || 0);
      console.log('✅ Group renamed successfully');
    } catch (error) {
      console.error('❌ Error renaming group:', error);
    }
  };

  const handleDeleteGroup = async (id: number) => {
    try {
      await deleteGroup(id);
      setSelectedGroup(null);
      console.log('✅ Group deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting group:', error);
    }
  };

  const handleCreateGroup = async () => {
    try {
      await createGroup();
      console.log('✅ Group created successfully');
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

      const result = await createBookmark(
        name,
        url,
        selectedGroupId || 0,
        false,
        ''
      );
      // const result = await api.mutation([
      //   'bookmark.create',
      //   {
      //     name,
      //     url,
      //     group_id: selectedGroupId || 0,
      //     is_favorite: false,
      //     tags: '',
      //   },
      // ]);

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

  const handleUpdateWorkspace = async (id: number, name: string) => {
    try {
      await updateWorkspace(id, name, selectedOrganizationId() ?? 0);
    } catch (error) {
      console.error('❌ Error deleting workspace:', error);
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
        // Close group bookmarks
        setSelectedGroup(null);
        clearSelection();
        break;

      case 'groups':
        // clsoe search results if any
        setResults([]);
        setSelectedIndex(0);
        break;

      case 'search':
        // clsoe group bookmarks
        setSelectedGroup(null);
        clearSelection();
        break;
    }

    setViewMode(newMode);
  };

  const handleCreateOrganization = async (
    name: string,
    createdUserId?: number
  ): Promise<number> => {
    if (!createdUserId) {
      console.error('created user id is not found');
    }

    try {
      const userId = currentUser()?.id ?? createdUserId;

      const result = await createOrganization(userId!, name);

      return result.id;
    } catch (error) {
      console.error('Failed to create organization:', error);
      throw error;
    }
  };

  const handleUpdateOrganization = async (id: number, name: string) => {
    try {
      const userId = currentUser()?.id || 1;
      await updateOrganization(id, userId, name);
    } catch (error) {
      console.error('Failed to update organization:', error);
      throw error;
    }
  };

  const handleDeleteOrganization = async (id: number) => {
    try {
      await deleteOrganization(id);
      if (selectedOrganizationId() === id) {
        const remainingOrganizations = organizations()?.filter(
          (org) => org.id !== id
        );
        if (remainingOrganizations && remainingOrganizations.length > 0) {
          selectOrganization(remainingOrganizations[0].id);
        } else {
          selectOrganization(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete organization:', error);
      throw error;
    }
  };

  return (
    <Show
      when={initializationData.loading}
      fallback={
        <Show
          when={isFirstTime() === false && isFirstTimeForOrg() === false}
          fallback={
            <FirstTimeSetup
              onComplete={handleFirstTimeSetupComplete}
              isFirstTimeForOrg={isFirstTimeForOrg()}
              firstUserId={currentUser()?.id}
              onCreateOrganization={handleCreateOrganization}
            />
          }
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
                <Show
                  when={workspaces() && workspaces()!.length > 0}
                  fallback={
                    <CreateWorkspaceSheet
                      onSubmit={handleCreateWorkspace}
                      triggerPlaceholder="init workspace"
                    />
                  }
                >
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
                </Show>
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
                      disabled={
                        isCreating() || isUpdating() || !workspaces()?.length
                      }
                    >
                      {isCreating() ? (
                        ' Creating...'
                      ) : groups() ? (
                        <>
                          <FiPlus />
                          New Group
                        </>
                      ) : (
                        'No groups found'
                      )}
                    </Button>
                  </div>

                  {/* Groups Section */}
                  <div class="flex flex-col">
                    <ListOfGroups
                      groups={groups()}
                      loading={groupsLoading}
                      error={groupsError()}
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
                    {/* Create Bookmark Button */}
                    <div class="flex justify-between items-center">
                      <h2 class="text-xl font-semibold text-white">
                        {selectedGroup()?.name} Bookmarks
                      </h2>
                      <CreateBookmarkSheet
                        onSubmit={handleCreateBookmark}
                        options={[
                          {
                            id: selectedGroup()!.id,
                            name: selectedGroup()!.name,
                          },
                        ]}
                        selectedGroupId={selectedGroup()?.id}
                      />
                    </div>
                    <GroupBookmarksList
                      group={selectedGroup()}
                      bookmarks={groupBookmarksList() || []}
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
                      // Workspace handlers
                      onWorkspaceSelect={handleWorkspaceSelect}
                      onUpdateWorkspace={handleUpdateWorkspace}
                      onDeleteWorkspace={handleDeleteWorkspace}
                      onClose={() => setViewMode('groups')}
                      // Organization handlers
                      onCreateOrganization={handleCreateOrganization}
                      onUpdateOrganization={handleUpdateOrganization}
                      onDeleteOrganization={handleDeleteOrganization}
                      onSelectOrganization={selectOrganization}
                      isCreatingOrg={false}
                      isUpdatingOrg={false}
                      isDeletingOrg={false}
                      // Workspace handlers
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
                  const newMode =
                    viewMode() === 'settings' ? 'groups' : 'settings';
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
      }
    >
      <div class="h-screen bg-black flex items-center justify-center">
        <div class="text-white text-lg">Loading...</div>
      </div>
    </Show>
  );
};

export default App;
