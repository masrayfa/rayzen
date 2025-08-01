import { Component, Show, For } from 'solid-js';
import { SearchResult, GroupsDto } from '../types';
import {
  FiBookmark,
  FiStar,
  FiExternalLink,
  FiX,
  FiLoader,
} from 'solid-icons/fi';

interface GroupBookmarksListProps {
  group: GroupsDto | null;
  bookmarks: SearchResult[];
  loading: boolean;
  error: any;
  onClose: () => void;
  onBookmarkSelect: (bookmark: SearchResult) => void;
}

const GroupBookmarksList: Component<GroupBookmarksListProps> = (props) => {
  return (
    <Show when={props.group}>
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-600">
        {/* Header */}
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <FiBookmark class="text-green-500" />
            <h3 class="text-lg font-semibold text-white">
              Bookmarks in "{props.group?.name}"
            </h3>
          </div>
          <button
            onClick={props.onClose}
            class="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Close"
          >
            <FiX class="text-gray-400" />
          </button>
        </div>

        {/* Loading State */}
        <Show when={props.loading}>
          <div class="flex items-center justify-center py-8">
            <FiLoader class="animate-spin mr-2 text-blue-500" />
            <span class="text-gray-300">Loading bookmarks...</span>
          </div>
        </Show>

        {/* Error State */}
        <Show when={props.error}>
          <div class="bg-red-900/20 border border-red-600 rounded p-4 text-red-200">
            <div class="font-medium">Failed to load bookmarks</div>
            <div class="text-sm mt-1">
              {props.error?.message || 'Unknown error occurred'}
            </div>
          </div>
        </Show>

        {/* Bookmarks List */}
        <Show when={!props.loading && !props.error}>
          <div class="space-y-3 max-h-96 overflow-y-auto">
            <For
              each={props.bookmarks}
              fallback={
                <div class="text-center py-8 text-gray-400">
                  <FiBookmark class="mx-auto mb-2 text-2xl" />
                  <p>No bookmarks found in this group</p>
                </div>
              }
            >
              {(bookmark) => (
                <div
                  class="group bg-gray-700/50 hover:bg-gray-700 rounded-lg p-4 cursor-pointer transition-all border border-gray-600 hover:border-gray-500"
                  onClick={() => props.onBookmarkSelect(bookmark)}
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center space-x-2 mb-2">
                        <h4 class="font-medium text-white truncate group-hover:text-blue-300 transition-colors">
                          {bookmark.title}
                        </h4>
                        {bookmark.is_favorite && (
                          <FiStar
                            class="text-yellow-400 flex-shrink-0"
                            size={14}
                          />
                        )}
                      </div>

                      <p class="text-sm text-gray-400 truncate mb-2">
                        {bookmark.url}
                      </p>

                      {/* Fixed tags section - added Array.isArray check */}
                      {bookmark.tags &&
                        Array.isArray(bookmark.tags) &&
                        bookmark.tags.length > 0 && (
                          <div class="flex flex-wrap gap-1">
                            <For each={bookmark.tags.slice(0, 3)}>
                              {(tag) => (
                                <span class="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded">
                                  {tag}
                                </span>
                              )}
                            </For>
                            {bookmark.tags.length > 3 && (
                              <span class="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded">
                                +{bookmark.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                    </div>

                    <FiExternalLink class="text-gray-400 group-hover:text-blue-400 flex-shrink-0 ml-2 transition-colors" />
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>

        {/* Footer */}
        <Show
          when={!props.loading && !props.error && props.bookmarks.length > 0}
        >
          <div class="mt-4 pt-4 border-t border-gray-600">
            <p class="text-sm text-gray-400 text-center">
              {props.bookmarks.length} bookmark
              {props.bookmarks.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </Show>
      </div>
    </Show>
  );
};

export default GroupBookmarksList;
