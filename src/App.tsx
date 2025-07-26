import { Component, createSignal } from 'solid-js';
import { SearchResult } from './types';
import { api } from './rpc';
import SearchResults from './components/SearcResult';
import { SearchInput } from './components/SearchInput';

const App: Component = () => {
  const [results, setResults] = createSignal<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = createSignal(0);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    const foundBookmarks = await api.query(['bookmark.searchBookmark', query]);
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

  return (
    <div class="min-h-screen bg-black">
      <div>
        <SearchInput
          onSearch={handleSearch}
          onNavigate={handleNavigate}
          onEnter={handleEnter}
        />
        {/* Organization Component */}
      </div>
      <div class="px-8 py-8">
        <SearchResults
          results={results()}
          selectedIndex={selectedIndex()}
          onSelectionChange={setSelectedIndex}
          onSelectItem={handleSelectItem}
        />

        <div class="fixed bottom-4 right-4 text-xs text-gray-500">
          <div>↑↓ Navigate • Enter Open • Esc Clear</div>
        </div>
      </div>
    </div>
  );
};

export default App;
