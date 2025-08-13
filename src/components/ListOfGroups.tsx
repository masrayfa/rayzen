import { createSignal, For, Show } from 'solid-js';
import { Card, CardContent } from './ui/card';
import { FiFolder, FiLoader, FiBookmark } from 'solid-icons/fi';
import { GroupsDto as Group, GroupsDto } from '../types';

interface ListOfGroupsProps {
  groups?: Group[];
  loading?: boolean;
  error?: any;
  onGroupSelect?: (group: GroupsDto) => void;
  selectedGroupId?: number | null;
}

const ListOfGroups = (props: ListOfGroupsProps) => {
  return (
    <div class="space-y-2 w-56">
      <Show when={props.loading}>
        <div class="flex items-center justify-center p-8">
          <FiLoader class="animate-spin mr-3 text-blue-500" size={20} />
          <span class="text-gray-300">Loading your groups...</span>
        </div>
      </Show>

      <Show when={props.error}>
        <div class="p-4 bg-red-900/20 border border-red-600 rounded-lg text-red-200">
          <div class="font-medium">Error loading groups</div>
          <div class="text-sm mt-1">
            {props.error?.message || 'Unknown error occurred'}
          </div>
        </div>
      </Show>

      <Show when={!props.loading && !props.error && props.groups}>
        <Show
          when={props.groups && props.groups.length > 0}
          fallback={
            <div class="text-center py-12">
              <FiFolder class="mx-auto mb-4 text-4xl text-gray-600" />
              <div class="text-gray-500 text-lg mb-2">No groups found</div>
              <div class="text-gray-600 text-sm">
                Create your first group to organize your bookmarks
              </div>
            </div>
          }
        >
          <div class="flex flex-col">
            <For each={props.groups}>
              {(group) => {
                const isSelected = () => props.selectedGroupId === group.id;
                return (
                  <Card
                    class={`cursor-pointer transition-all duration-200 border-0 hover:scale-105 hover:shadow-lg ${
                      isSelected()
                        ? 'bg-gray-500/20 border-gray-500/20 ring-1 ring-gray-500/30'
                        : 'bg-gray-500/10 hover:bg-gray-500/20'
                    }`}
                    onclick={() => props.onGroupSelect?.(group)}
                  >
                    <CardContent class="p-3">
                      <div class="flex items-center space-x-4">
                        <FiFolder
                          class={`flex-shrink-0 ${'text-gray-400'}`}
                          size={20}
                        />
                        <div class="flex-1 min-w-0">
                          <h3
                            class={`text-sm font-medium truncate ${'text-white'}`}
                          >
                            {group.name}
                          </h3>
                          {/* Tambahan info jika ada */}
                          {/* {group.description && (
                            <p class="text-sm text-gray-400 truncate mt-1">
                              {group.description}
                            </p>
                          )} */}
                          {/* Bookmark count jika tersedia */}
                          {/* {group.bookmarkCount !== undefined && (
                            <div class="flex items-center mt-2 text-xs text-gray-500">
                              <FiBookmark size={12} class="mr-1" />
                              {group.bookmarkCount} bookmark{group.bookmarkCount !== 1 ? 's' : ''}
                            </div>
                          )} */}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              }}
            </For>
          </div>
        </Show>
      </Show>
    </div>
  );
};

export default ListOfGroups;
