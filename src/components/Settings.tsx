import { Component, createEffect, createSignal, For, Show } from 'solid-js';
import { Button } from './ui/button';
import { FiCheck, FiEdit2, FiSave, FiTrash2, FiX } from 'solid-icons/fi';
import OrganizationSettings from './OrganizationSettings';
import WorkspaceSettings from './WorkspaceSettings';
import { WorkspaceDto } from '~/types';
import { useWorkspace } from '~/hooks/useWorkspace';
import { useOrganization } from '~/hooks/useOrganization';

interface SettingsProps {
  selectedWorkspaceId: () => number | null;
  onWorkspaceSelect: (id: number) => void;
  onDeleteWorkspace: (id: number) => void;
  onClose: () => void;
  workspaces: WorkspaceDto[];
  organizations: Array<{ id: number; name: string }>;
  organizationId: number;
}

const Settings: Component<SettingsProps> = (props) => {
  const [editingWorkspaceId, setEditingWorkspaceId] = createSignal<
    number | null
  >(null);
  const [editWorkspaceName, setEditWorkspaceName] = createSignal('');

  const { selectedOrganizationId } = useOrganization();

  const {
    workspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    isCreating: isCreatingWorkspace,
    isUpdating: isUpdatingWorkspace,
    isDeleting: isDeletingWorkspace,
    refetchWorkspaces,
  } = useWorkspace();

  const handleUpdateWorkspace = async (id: number) => {
    if (!editWorkspaceName().trim()) return;

    try {
      await updateWorkspace(
        id,
        editWorkspaceName().trim(),
        selectedOrganizationId() || 1
      );
      setEditingWorkspaceId(null);
      setEditWorkspaceName('');
    } catch (error) {
      console.error('Failed to update workspace:', error);
    }
  };

  const cancelEditingWorkspace = () => {
    setEditingWorkspaceId(null);
    setEditWorkspaceName('');
  };

  const startEditingWorkspace = (id: number, name: string) => {
    setEditingWorkspaceId(id);
    setEditWorkspaceName(name);
  };

  const handleDeleteWorkspace = async (id: number) => {
    if (
      confirm(
        'Are you sure you want to delete this workspace? This action cannot be undone.'
      )
    ) {
      try {
        await deleteWorkspace(id);
        props.onDeleteWorkspace(id);
      } catch (error) {
        console.error('Failed to delete workspace:', error);
      }
    }
  };

  return (
    <div class="text-white space-y-8">
      {/* Header with close button */}
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">Settings</h2>
        <Button
          variant="ghost"
          size="sm"
          onclick={props.onClose}
          class="text-gray-400 hover:text-white"
        >
          <FiX size={20} />
        </Button>
      </div>

      {/* Organization Settings Section */}
      {/* <div class="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50">
        <OrganizationSettings
          organizations={props.organizations}
          organizationId={props.organizationId}
        />
      </div> */}

      {/* Workspace Settings Section */}
      <div class="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 space-y-3">
        <For each={props.workspaces}>
          {(workspace) => (
            <div class="bg-gray-800/30 p-4 rounded-lg flex items-center justify-between">
              <Show
                when={editingWorkspaceId() === workspace.id}
                fallback={
                  <div class="flex items-center gap-3">
                    <span class="text-white font-medium">{workspace.name}</span>
                    <Show when={props.selectedWorkspaceId() === workspace.id}>
                      <span class="text-xs bg-green-600 px-2 py-1 rounded font-medium flex items-center gap-1">
                        <FiCheck size={12} />
                        Active
                      </span>
                    </Show>
                  </div>
                }
              >
                <input
                  type="text"
                  class="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  value={editWorkspaceName()}
                  onInput={(e) => setEditWorkspaceName(e.currentTarget.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleUpdateWorkspace(workspace.id);
                    if (e.key === 'Escape') cancelEditingWorkspace();
                  }}
                />
              </Show>

              <div class="flex gap-2">
                <Show
                  when={editingWorkspaceId() === workspace.id}
                  fallback={
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onclick={() => props.onWorkspaceSelect(workspace.id)}
                        disabled={props.selectedWorkspaceId() === workspace.id}
                        class={
                          props.selectedWorkspaceId() === workspace.id
                            ? 'opacity-50'
                            : 'border-blue-500 text-blue-400 hover:bg-blue-500/10'
                        }
                      >
                        {props.selectedWorkspaceId() === workspace.id
                          ? 'Active'
                          : 'Select'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onclick={() =>
                          startEditingWorkspace(workspace.id, workspace.name)
                        }
                        disabled={isUpdatingWorkspace()}
                      >
                        <FiEdit2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onclick={() => handleDeleteWorkspace(workspace.id)}
                        disabled={isDeletingWorkspace()}
                        class="text-red-400 hover:text-red-300"
                      >
                        <FiTrash2 size={16} />
                      </Button>
                    </div>
                  }
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onclick={() => handleUpdateWorkspace(workspace.id)}
                    disabled={
                      isUpdatingWorkspace() || !editWorkspaceName().trim()
                    }
                  >
                    <FiSave size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onclick={cancelEditingWorkspace}
                  >
                    <FiX size={16} />
                  </Button>
                </Show>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default Settings;
