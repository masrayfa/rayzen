import { createSignal, For, Show, onCleanup, onMount } from 'solid-js';
import { Card, CardContent } from './ui/card';
import { FiFolder, FiLoader, FiCheck, FiX } from 'solid-icons/fi';
import { GroupsDto as Group, GroupsDto } from '../types';
import NoGroupsFound from './NoGroupsFound';

interface ListOfGroupsProps {
  groups?: Group[];
  loading?: boolean;
  error?: any;
  onGroupSelect?: (group: GroupsDto) => void;
  selectedGroupId?: number | null;
  onRenameGroup?: (group: GroupsDto) => void;
  onDeleteGroup?: (groupId: number) => void;
}

const ListOfGroups = (props: ListOfGroupsProps) => {
  const [editingGroupId, setEditingGroupId] = createSignal<number | null>(null);
  const [editingName, setEditingName] = createSignal<string>('');

  const startEditing = (group: GroupsDto, event: Event) => {
    console.log('🎯 startEditing called for:', group.name);
    event.stopPropagation();
    setEditingGroupId(group.id);
    setEditingName(group.name);
  };

  const saveEditing = () => {
    const groupId = editingGroupId();
    const newName = editingName().trim();

    console.log('🔄 saveEditing called:', { groupId, newName });

    // Early return jika sudah tidak editing (prevent double call)
    if (!groupId) {
      console.log('⚠️ No groupId, already saved or cancelled');
      return;
    }

    if (newName && newName.length > 0) {
      const group = props.groups?.find((g) => g.id === groupId);
      console.log('🔍 Found group:', group);

      if (group && newName !== group.name) {
        console.log('📝 Calling onRenameGroup with:', {
          ...group,
          name: newName,
        });

        // Clear editing state FIRST to prevent double calls
        setEditingGroupId(null);
        setEditingName('');

        // Then call the rename
        props.onRenameGroup?.({
          ...group,
          name: newName,
        });
        return;
      } else {
        console.log('⚠️ No changes detected');
      }
    } else {
      console.log('❌ Invalid name:', newName);
    }

    // Clear editing state
    setEditingGroupId(null);
    setEditingName('');
  };

  const cancelEditing = () => {
    setEditingGroupId(null);
    setEditingName('');
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      console.log('⌨️ Enter pressed, saving...');
      saveEditing();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      console.log('⌨️ Escape pressed, canceling...');
      cancelEditing();
    }
  };

  const handleBlur = () => {
    console.log('👋 Input blurred, checking if should save...');

    // Only save if still editing (prevent double call)
    if (editingGroupId() !== null) {
      console.log('💾 Saving on blur...');
      saveEditing();
    } else {
      console.log('⏭️ Already saved, skipping blur save');
    }
  };

  return (
    <div
      class="w-57 max-h-[60vh] overflow-auto"
      style={{ 'scrollbar-width': 'none' }}
    >
      <Show when={props.loading}>
        <div class="flex items-center justify-center p-9">
          <FiLoader class="animate-spin mr-4 text-blue-500" size={20} />
          <span class="text-gray-300">Loading your groups...</span>
        </div>
      </Show>

      <Show when={props.error}>
        <div class="p-5 bg-red-900/20 border border-red-600 rounded-lg text-red-200">
          <div class="font-medium">Error loading groups</div>
          <div class="text-sm mt-2">
            {props.error?.message || 'Unknown error occurred'}
          </div>
        </div>
      </Show>

      <Show when={!props.loading && !props.error && props.groups}>
        <Show
          when={props.groups && props.groups.length > 0}
          fallback={<NoGroupsFound />}
        >
          <div class="flex flex-col space-y-4 p-2">
            <For each={props.groups}>
              {(group) => {
                const isSelected = () => props.selectedGroupId === group.id;
                const isEditing = () => editingGroupId() === group.id;

                return (
                  <Card
                    class={`cursor-pointer transition-all duration-200 border-0 hover:scale-105 hover:shadow-lg ${
                      isSelected()
                        ? 'bg-gray-500/20 border-gray-500/20 ring-1 ring-gray-500/30'
                        : 'bg-gray-500/10 hover:bg-gray-500/20'
                    }`}
                    onclick={(e) => {
                      if (!isEditing()) {
                        props.onGroupSelect?.(group);
                      }
                    }}
                  >
                    <CardContent class="p-4">
                      <div class="flex items-center space-x-3">
                        <FiFolder class="shrink-0 text-gray-400" size={19} />
                        <div class="flex flex-1 min-w-0 justify-between">
                          <Show
                            when={isEditing()}
                            fallback={
                              <div
                                class="text-sm font-medium text-white truncate cursor-text py-1 px-1 rounded"
                                onClick={(e) => {
                                  console.log(
                                    '📝 Text clicked, starting edit...'
                                  );
                                  e.stopPropagation();
                                  startEditing(group, e);
                                }}
                                title="Click to edit"
                              >
                                {group.name}
                              </div>
                            }
                          >
                            <input
                              type="text"
                              value={editingName()}
                              onInput={(e) => {
                                console.log(
                                  '✏️ Input changed:',
                                  e.currentTarget.value
                                );
                                setEditingName(e.currentTarget.value);
                              }}
                              onKeyDown={handleKeyDown}
                              onBlur={handleBlur}
                              class="flex-1 max-w-32 text-sm font-medium text-white px-2 py-1 focus:outline-none"
                              placeholder="Enter group name"
                              autofocus
                            />
                          </Show>
                          <button
                            class="p-1 hover:bg-gray-600 rounded-sm text-red-400 transition-colors"
                            onClick={(e) => {
                              console.log('❌ Remove button clicked');
                              e.stopPropagation();
                              props.onDeleteGroup?.(group.id);
                            }}
                            title="Remove"
                          >
                            <FiX size={14} color="white" />
                          </button>
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
