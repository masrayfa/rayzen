import { Component, For, createSignal, createEffect } from 'solid-js';
import { SearchResult } from '../types';
import { toast } from 'solid-sonner';

interface SearchResultsProps {
  results: SearchResult[];
  selectedIndex: number;
  onSelectionChange: (index: number) => void;
  onSelectItem: (result: SearchResult) => void;
}

const SearchResults: Component<SearchResultsProps> = (props) => {
  // Reset selection when results change
  createEffect(() => {
    if (
      props.results.length > 0 &&
      props.selectedIndex >= props.results.length
    ) {
      props.onSelectionChange(0);
    }
  });

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
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div class="w-full mt-4">
      {props.results.length > 0 && (
        <div class="border border-white/10 rounded-xl overflow-hidden">
          <For each={props.results}>
            {(result, index) => (
              <div
                class={`px-4 py-3 border-b border-gray-700 last:border-b-0 cursor-pointer transition-colors ${
                  index() === props.selectedIndex
                    ? 'bg-white/10'
                    : 'hover:bg-white/20'
                }`}
                onClick={() => {
                  props.onSelectItem(result);
                  toast('Link is copied to clipboard');
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
                    <p class="text-gray-400 text-sm truncate">{result.url}</p>
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

      {/* {props.results.length === 0 && (
        <div class="text-center py-12">
          <div class="text-gray-500 text-lg">No results found</div>
          <div class="text-gray-600 text-sm mt-1">
            Try searching for bookmarks, groups, or workspaces
          </div>
        </div>
      )} */}
    </div>
  );
};

export default SearchResults;
