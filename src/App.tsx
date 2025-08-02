import { Component, createResource, createSignal, Show } from 'solid-js';
import { GroupsDto, SearchResult } from './types';
import { api } from './rpc';
import SearchResults from './components/SearcResult';
import { SearchInput } from './components/SearchInput';
import ListOfGroups from './components/ListOfGroups';
import { useGroupBookmarks } from './hooks/useGroupBookmarks';
import GroupBookmarksList from './components/GroupBookmarksList';
import { SelectWorkspace } from './components/SelectWorkspace';

const App: Component = () => {
  const [results, setResults] = createSignal<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const [selectedGroup, setSelectedGroup] = createSignal<GroupsDto | null>(
    null
  );
  const [selectedWorkspaceId, setSelectedWorkspaceId] = createSignal(0);

  const {
    bookmarks: groupBookmarksList,
    clearSelection,
    error: bookmarksError,
    groupBookmarks,
    hasBookmarks,
    isGroupSelected,
    loading: bookmarksLoading,
    selectGroup,
    selectedGroupId,
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
      window.open(selected.url, '_blank');
    }
  };

  const handleSelectItem = (result: SearchResult) => {
    if (result.url) {
      window.open(result.url, '_blank');
    }
  };

  const handleGroupSelect = (group: GroupsDto) => {
    setSelectedGroup(group);
    selectGroup(group.id);
  };

  return (
    <div class="min-h-screen bg-black">
      <div class="flex static gap-1">
        <SearchInput
          onSearch={handleSearch}
          onNavigate={handleNavigate}
          onEnter={handleEnter}
        />
        <SelectWorkspace />

        {/* Organization Component */}
      </div>
      <div class="px-8 py-8">
        <SearchResults
          results={results()}
          selectedIndex={selectedIndex()}
          onSelectionChange={setSelectedIndex}
          onSelectItem={handleSelectItem}
        />

        {/* Groups Section */}
        <ListOfGroups
          groups={groups()}
          loading={groups.loading}
          error={groups.error}
          onGroupSelect={handleGroupSelect}
          selectedGroupId={selectedGroupId()}
        />

        {/* Group Bookmarks Section */}
        {/* <Show when={selectedGroup()}>
            <GroupBookmarksList
              group={selectedGroup()}
              bookmarks={groupBookmarksList()}
              loading={bookmarksLoading}
              error={bookmarksError}
              onClose={handleCloseGroupBookmarks}
              onBookmarkSelect={handleBookmarkSelect}
            />
          </Show> */}

        {/* Debug Info - Remove in production */}
        {import.meta.env.DEV && (
          <div class="bg-gray-500/10 rounded p-4 text-xs text-gray-400 mt-10">
            <details>
              <summary class="cursor-pointer">Debug Info</summary>
              <div class="mt-2 space-y-1">
                <div>Selected Group: {selectedGroup()?.name || 'None'}</div>
                <div>Group Bookmarks: {groupBookmarksList().length}</div>
                <div>Search Results: {results().length}</div>
                <div>Groups Total: {groups()?.length || 0}</div>
              </div>
            </details>
          </div>
        )}

        <div class="fixed bottom-4 right-4 text-xs text-gray-500">
          <div>↑↓ Navigate • Enter Open • Esc Clear</div>
        </div>
      </div>
    </div>
  );
};

export default App;
