import { Component, createSignal } from 'solid-js';
import SearchInput from './components/SearchInput';
// import SearchResults from './components/SearchResults';
import { SearchResult } from './types';
import { api } from './rpc';
import SearchResults from './components/SearcResult';

const App: Component = () => {
  const [results, setResults] = createSignal<SearchResult[]>([]);

  const handleSearch = async (query: string) => {
    const foundBookmarks = await api.query(['bookmark.searchBookmark', query]);

    let searchResults: SearchResult[] = [
      {
        id: 0,
        title: '',
        type: 'bookmark',
        is_favorite: false,
        tags: '',
        url: '',
      },
    ];

    foundBookmarks.map((bookmark) => {
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
  };

  return (
    <div class="min-h-screen bg-black">
      <div class="container mx-auto px-4 py-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold mb-2">Raycast Clone</h1>
          <p class="text-gray-400">
            Search your bookmarks, groups, and workspaces
          </p>
        </div>

        <SearchInput onSearch={handleSearch} />
        <SearchResults results={results()} />

        <div class="fixed bottom-4 right-4 text-xs text-gray-500">
          <div>↑↓ Navigate • Enter Open • Esc Clear</div>
        </div>
      </div>
    </div>
  );
};

export default App;
