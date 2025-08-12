import { Component, createResource, createSignal, Show } from 'solid-js';
import { GroupsDto, SearchResult } from './types';
import { api } from './rpc';
import SearchResults from './components/SearchResult';
import { SearchInput } from './components/SearchInput';
import ListOfGroups from './components/ListOfGroups';
import { useGroupBookmarks } from './hooks/useGroupBookmarks';
import GroupBookmarksList from './components/GroupBookmarksList';
import { SelectWorkspace } from './components/SelectWorkspace';
import { Button } from './components/ui/button';
import { FiPlus } from 'solid-icons/fi';
import { Toaster } from './components/ui/sonner';

const App: Component = () => {
  const [selectedGroup, setSelectedGroup] = createSignal<GroupsDto | null>(
    null
  );
  const [selectedWorkspaceId, setSelectedWorkspaceId] = createSignal(0);
  const [results, setResults] = createSignal<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const [viewMode, setViewMode] = createSignal<
    'groups' | 'bookmarks' | 'search'
  >('groups');

  const {
    bookmarks: groupBookmarksList,
    clearSelection,
    error: bookmarksError,
    loading: bookmarksLoading,
    selectGroup,
  } = useGroupBookmarks();

  const [groups] = createResource(() =>
    api.query(['groups.getBelongedGroups', 1])
  );

  const [workspace] = createResource(() =>
    api.query(['workspace.getWorkspaceById', 1])
  );

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

  return (
    <div class="h-screen bg-black flex flex-col overflow-hidden">
      {/* Header Section - Fixed */}
      <div class="flex-shrink-0">
        <SearchInput
          onSearch={handleSearch}
          onNavigate={handleNavigate}
          onEnter={handleEnter}
        />
        {/* <div class="flex static gap-1">
          <SelectWorkspace />
        </div> */}
      </div>

      {/* Main Content - Flexible */}
      <div class="flex flex-1 overflow-hidden">
        {/* Sidebar - Fixed width, no scroll */}
        <div class="px-8 py-8 bg-gray-500/10 flex-shrink-0">
          {/* New group button */}
          <div class="pb-5 ">
            <Button
              variant={'ghost'}
              class="text-white/80 hover:bg-gray-500/10 hover:text-white w-full justify-start"
            >
              <FiPlus />
              New Group
            </Button>
          </div>

          {/* Groups Section */}
          <div class="flex gap-4">
            <ListOfGroups
              groups={groups()}
              loading={groups.loading}
              error={groups.error}
              onGroupSelect={handleGroupSelect}
              selectedGroupId={selectedGroup()?.id || 0}
            />
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
            <GroupBookmarksList
              group={selectedGroup()}
              bookmarks={groupBookmarksList()}
              loading={bookmarksLoading}
              error={bookmarksError}
              onClose={handleCloseGroupBookmarks}
              onBookmarkSelect={handleBookmarkSelect}
            />
          </Show>
        </div>
      </div>

      {/* Footer - Fixed */}
      <div class="fixed bottom-4 right-4 text-xs text-gray-500 flex-shrink-0">
        <div>↑↓ Navigate • Enter Open • Esc Clear</div>
      </div>

      <Toaster theme="dark" />
    </div>
  );
};

export default App;
