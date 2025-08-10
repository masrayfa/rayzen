import { SearchInput } from './SearchInput';
import { SearchResult } from '~/types';
import { api } from '~/rpc';
import { createSignal, Show } from 'solid-js';
import SearchResults from './SearchResult';

const PageWrapper = () => {
  const [results, setResults] = createSignal<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = createSignal(0);

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

  return (
    <div>
      <SearchInput
        onSearch={handleSearch}
        onNavigate={handleNavigate}
        onEnter={handleEnter}
      />

      <Show when={results().length > 0}>
        <SearchResults
          results={results()}
          selectedIndex={selectedIndex()}
          onSelectionChange={setSelectedIndex}
          onSelectItem={handleSelectItem}
        />
      </Show>
    </div>
  );
};

export default PageWrapper;
