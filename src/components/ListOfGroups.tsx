import { createSignal, For, Show } from 'solid-js';
import { Card, CardContent } from './ui/card';
import { FiFolder, FiLoader } from 'solid-icons/fi';
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
    <div class="w-full space-y-2">
      <Show when={props.loading}>
        <div class="flex items-center justify-center p-4">
          <FiLoader class="animate-spin mr-2" />
          <span class="text-white">Loading groups...</span>
        </div>
      </Show>

      <Show when={props.error}>
        <div class="p-4 bg-red-100 border border-red-300 rounded text-red-700">
          Error loading groups: {props.error?.message || 'Unknown error'}
        </div>
      </Show>

      <Show when={!props.loading && !props.error && props.groups}>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <For
            each={props.groups}
            fallback={
              <div class="col-span-full text-center text-gray-500 p-4">
                No groups found
              </div>
            }
          >
            {(group) => {
              const isSelected = () => props.selectedGroupId === group.id;

              return (
                <Card
                  class={`cursor-pointer transition-all duration-200 border-0 bg-gray-500/10 ${isSelected}`}
                  onclick={() => props.onGroupSelect?.(group)}
                >
                  <CardContent class="p-4">
                    <div class="flex items-center space-x-3">
                      <FiFolder class="text-red-500 flex-shrink-0" />
                      <div class="flex-1 min-w-0">
                        <h3 class="font-medium text-white truncate">
                          {group.name}
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            }}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default ListOfGroups;
