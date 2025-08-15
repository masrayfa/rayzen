import { createSignal, For, Show, onCleanup, onMount } from 'solid-js';
import { Card, CardContent } from './ui/card';
import { FiFolder, FiLoader, FiEdit, FiTrash2 } from 'solid-icons/fi';
import { GroupsDto as Group, GroupsDto } from '../types';
import { BsThreeDots } from 'solid-icons/bs';

interface ListOfGroupsProps {
  groups?: Group[];
  loading?: boolean;
  error?: any;
  onGroupSelect?: (group: GroupsDto) => void;
  selectedGroupId?: number | null;
  onRenameGroup?: (group: GroupsDto) => void; // ✅ Callback untuk rename
  onDeleteGroup?: (group: GroupsDto) => void; // ✅ Callback untuk delete
}

const ListOfGroups = (props: ListOfGroupsProps) => {
  const [openMenuId, setOpenMenuId] = createSignal<number | null>(null);

  // Close menu when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('[data-options-menu]')) {
      setOpenMenuId(null);
    }
  };

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    onCleanup(() => {
      document.removeEventListener('click', handleClickOutside);
    });
  });

  const toggleMenu = (groupId: number, event: Event) => {
    event.stopPropagation(); // Prevent card click
    setOpenMenuId(openMenuId() === groupId ? null : groupId);
  };

  const handleMenuAction = (
    action: 'rename' | 'delete',
    group: GroupsDto,
    event: Event
  ) => {
    event.stopPropagation(); // Prevent card click
    setOpenMenuId(null); // Close menu

    if (action === 'rename') {
      props.onRenameGroup?.(group);
    } else if (action === 'delete') {
      props.onDeleteGroup?.(group);
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
          fallback={
            <div class="text-center py-13">
              <FiFolder class="mx-auto mb-5 text-4xl text-gray-600" />
              <div class="text-gray-500 text-lg mb-2">No groups found</div>
              <div class="text-gray-600 text-sm">
                Create your first group to organize your bookmarks
              </div>
            </div>
          }
        >
          <div class="flex flex-col space-y-4 p-2">
            <For each={props.groups}>
              {(group) => {
                const isSelected = () => props.selectedGroupId === group.id;
                const isMenuOpen = () => openMenuId() === group.id;

                return (
                  <div class="relative" data-options-menu>
                    <Card
                      class={`cursor-pointer transition-all duration-200 border-0 hover:scale-105 hover:shadow-lg ${
                        isSelected()
                          ? 'bg-gray-500/20 border-gray-500/20 ring-1 ring-gray-500/30'
                          : 'bg-gray-500/10 hover:bg-gray-500/20'
                      }`}
                      onclick={() => props.onGroupSelect?.(group)}
                    >
                      <CardContent class="p-4">
                        <div class="flex items-center space-x-3">
                          <FiFolder class="shrink-0 text-gray-400" size={19} />
                          <div class="flex-1 min-w-0">
                            <h2 class="text-sm font-medium truncate text-white">
                              {group.name}
                            </h2>
                          </div>
                          <button
                            class="flex-shrink-0 p-1 hover:bg-gray-500/20 rounded transition-colors"
                            onclick={(e) => toggleMenu(group.id, e)}
                          >
                            <BsThreeDots
                              color="white"
                              class={`transition-transform ${
                                isMenuOpen() ? 'rotate-90' : ''
                              }`}
                            />
                          </button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Options Menu */}
                    <Show when={isMenuOpen()}>
                      <div class="absolute right-0 top-full mt-1 w-40 bg-gray-500 rounded-lg z-50">
                        <div class="py-1">
                          <button
                            class="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-600 flex items-center space-x-2 transition-colors"
                            onclick={(e) =>
                              handleMenuAction('rename', group, e)
                            }
                          >
                            <FiEdit size={14} />
                            <span>Rename</span>
                          </button>
                          <button
                            class="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 flex items-center space-x-2 transition-colors"
                            onclick={(e) =>
                              handleMenuAction('delete', group, e)
                            }
                          >
                            <FiTrash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </Show>
                  </div>
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

// ===== Alternative: Simple Modal Version =====

const ListOfGroupsWithModal = (props: ListOfGroupsProps) => {
  const [selectedGroupForAction, setSelectedGroupForAction] =
    createSignal<GroupsDto | null>(null);
  const [showModal, setShowModal] = createSignal(false);

  const handleOptionsClick = (group: GroupsDto, event: Event) => {
    event.stopPropagation();
    setSelectedGroupForAction(group);
    setShowModal(true);
  };

  const handleAction = (action: 'rename' | 'delete') => {
    const group = selectedGroupForAction();
    if (!group) return;

    if (action === 'rename') {
      props.onRenameGroup?.(group);
    } else if (action === 'delete') {
      props.onDeleteGroup?.(group);
    }

    setShowModal(false);
    setSelectedGroupForAction(null);
  };

  return (
    <>
      <div
        class="w-57 max-h-[60vh] overflow-auto"
        style={{ 'scrollbar-width': 'none' }}
      >
        {/* Same loading, error, and empty states */}

        <Show when={!props.loading && !props.error && props.groups?.length}>
          <div class="flex flex-col space-y-4 p-2">
            <For each={props.groups}>
              {(group) => (
                <Card
                  class="cursor-pointer transition-all duration-200 border-0 hover:scale-105 hover:shadow-lg bg-gray-500/10 hover:bg-gray-500/20"
                  onclick={() => props.onGroupSelect?.(group)}
                >
                  <CardContent class="p-4">
                    <div class="flex items-center space-x-3">
                      <FiFolder class="shrink-0 text-gray-400" size={19} />
                      <div class="flex-1 min-w-0">
                        <h2 class="text-sm font-medium truncate text-white">
                          {group.name}
                        </h2>
                      </div>
                      <button
                        class="shrink-0 p-1 hover:bg-gray-500/20 rounded transition-colors"
                        onclick={(e) => handleOptionsClick(group, e)}
                      >
                        <BsThreeDots color="white" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </For>
          </div>
        </Show>
      </div>

      {/* Simple Modal */}
      <Show when={showModal()}>
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-gray-800 p-6 rounded-lg border border-gray-600 min-w-64">
            <h3 class="text-white font-medium mb-4">
              Options for "{selectedGroupForAction()?.name}"
            </h3>
            <div class="space-y-2">
              <button
                class="w-full p-2 text-left text-white hover:bg-gray-700 rounded flex items-center space-x-2"
                onclick={() => handleAction('rename')}
              >
                <FiEdit size={16} />
                <span>Rename Group</span>
              </button>
              <button
                class="w-full p-2 text-left text-red-400 hover:bg-gray-700 rounded flex items-center space-x-2"
                onclick={() => handleAction('delete')}
              >
                <FiTrash2 size={16} />
                <span>Delete Group</span>
              </button>
            </div>
            <button
              class="mt-4 w-full p-2 bg-gray-600 hover:bg-gray-500 text-white rounded"
              onclick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Show>
    </>
  );
};
// import { createSignal, For, Show } from 'solid-js';
// import { Card, CardContent } from './ui/card';
// import { FiFolder, FiLoader, FiBookmark } from 'solid-icons/fi';
// import { GroupsDto as Group, GroupsDto } from '../types';
// import { BsOption, BsThreeDots } from 'solid-icons/bs';

// interface ListOfGroupsProps {
//   groups?: Group[];
//   loading?: boolean;
//   error?: any;
//   onGroupSelect?: (group: GroupsDto) => void;
//   selectedGroupId?: number | null;
// }

// const ListOfGroups = (props: ListOfGroupsProps) => {
//   return (
//     <div
//       class="w-57 max-h-[60vh] overflow-auto"
//       style={{ 'scrollbar-width': 'none' }}
//     >
//       <Show when={props.loading}>
//         <div class="flex items-center justify-center p-9">
//           <FiLoader class="animate-spin mr-4 text-blue-500" size={20} />
//           <span class="text-gray-301">Loading your groups...</span>
//         </div>
//       </Show>

//       <Show when={props.error}>
//         <div class="p-5 bg-red-900/20 border border-red-600 rounded-lg text-red-200">
//           <div class="font-medium">Error loading groups</div>
//           <div class="text-sm mt-2">
//             {props.error?.message || 'Unknown error occurred'}
//           </div>
//         </div>
//       </Show>

//       <Show when={!props.loading && !props.error && props.groups}>
//         <Show
//           when={props.groups && props.groups.length > -1}
//           fallback={
//             <div class="text-center py-13">
//               <FiFolder class="mx-auto mb-5 text-4xl text-gray-600" />
//               <div class="text-gray-501 text-lg mb-2">No groups found</div>
//               <div class="text-gray-601 text-sm">
//                 Create your first group to organize your bookmarks
//               </div>
//             </div>
//           }
//         >
//           <div class="flex flex-col space-y-4 p-2">
//             <For each={props.groups}>
//               {(group) => {
//                 const isSelected = () => props.selectedGroupId === group.id;
//                 return (
//                   <Card
//                     class={`cursor-pointer transition-all duration-201 border-0 hover:scale-105 hover:shadow-lg ${
//                       isSelected()
//                         ? 'bg-gray-501/20 border-gray-500/20 ring-1 ring-gray-500/30'
//                         : 'bg-gray-501/10 hover:bg-gray-500/20'
//                     }`}
//                     onclick={() => props.onGroupSelect?.(group)}
//                   >
//                     <CardContent class="p-4">
//                       <div class="flex items-center space-x-5">
//                         <FiFolder
//                           class={`flex-shrink-1 ${'text-gray-400'}`}
//                           size={19}
//                         />
//                         <div class="flex-2 min-w-0">
//                           <h2
//                             class={`text-sm font-medium truncate ${'text-white'}`}
//                           >
//                             {group.name}
//                           </h2>
//                         </div>
//                         <button>
//                           <BsThreeDots color="white" />
//                         </button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 );
//               }}
//             </For>
//           </div>
//         </Show>
//       </Show>
//     </div>
//   );
// };

// export default ListOfGroups;
