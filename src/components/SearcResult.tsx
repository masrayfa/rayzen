import { Component, For, createSignal, onMount, onCleanup } from 'solid-js';
import { SearchResult } from '../types';

interface SearchResultsProps {
  results: SearchResult[];
}

const SearchResults: Component<SearchResultsProps> = (props) => {
  const [selectedIndex, setSelectedIndex] = createSignal(0);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (props.results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < props.results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : props.results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        const selected = props.results[selectedIndex()];
        if (selected?.url) {
          window.open(selected.url, '_blank');
        }
        break;
    }
  };

  onMount(() => {
    document.addEventListener('keydown', handleKeyDown);
  });

  onCleanup(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });

  // Reset selection when results change
  const resetSelection = () => {
    setSelectedIndex(0);
  };

  // Watch for results changes
  let prevResultsLength = props.results.length;
  const checkResultsChange = () => {
    if (props.results.length !== prevResultsLength) {
      resetSelection();
      prevResultsLength = props.results.length;
    }
  };
  checkResultsChange();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bookmark':
        return '🔖';
      case 'group':
        return '📁';
      case 'workspace':
        return '🏢';
      case 'organization':
        return '🏛️';
      default:
        return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bookmark':
        return 'text-blue-400';
      case 'group':
        return 'text-green-400';
      case 'workspace':
        return 'text-purple-400';
      case 'organization':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div class="w-full max-w-2xl mx-auto mt-4">
      {props.results.length > 0 && (
        <div class="border border-gray-700 rounded-xl overflow-hidden">
          <For each={props.results}>
            {(result, index) => (
              <div
                class={`px-4 py-3 border-b border-gray-700 last:border-b-0 cursor-pointer transition-colors ${
                  index() === selectedIndex() ? 'bg-black' : 'hover:bg-white/40'
                }`}
                onClick={() => {
                  if (result.url) {
                    window.open(result.url, '_blank');
                  }
                }}
              >
                <div class="flex items-center space-x-3">
                  <span class="text-xl">{getTypeIcon(result.type)}</span>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-2">
                      <h3 class="text-white font-medium truncate">
                        {result.title}
                      </h3>
                      {result.is_favorite && (
                        <span class="text-yellow-400">⭐</span>
                      )}
                    </div>
                    <p class="text-gray-400 text-sm truncate">{'subtitle'}</p>
                    {/* {result.tags && result.tags.length > 0 && (
                      <div class="flex flex-wrap gap-1 mt-1">
                        <For each={result.tags.slice(0, 3)}>
                          {(tag) => (
                            <span class="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
                              {tag}
                            </span>
                          )}
                        </For>
                      </div>
                    )} */}
                  </div>
                  <div
                    class={`text-xs uppercase font-medium ${getTypeColor(
                      result.type
                    )}`}
                  >
                    {result.type}
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      )}

      {props.results.length === 0 && (
        <div class="text-center py-12">
          <div class="text-gray-500 text-lg">No results found</div>
          <div class="text-gray-600 text-sm mt-1">
            Try searching for bookmarks, groups, or workspaces
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
