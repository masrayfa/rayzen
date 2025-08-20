import { Component, createSignal, Show, For, createMemo } from 'solid-js';
import { Button } from './ui/button';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
  FiCheck,
} from 'solid-icons/fi';
import { useWorkspace } from '../hooks/useWorkspace';
import { useOrganization } from '../hooks/useOrganization';

interface WorkspaceSettingsProps {
  selectedWorkspaceId: () => number | null;
  onWorkspaceSelect: (id: number) => void;
  onDeleteWorkspace: (id: number) => void;
}

const WorkspaceSettings: Component<WorkspaceSettingsProps> = (props) => {
  const {
    workspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    isCreating: isCreatingWorkspace,
    isUpdating: isUpdatingWorkspace,
    isDeleting: isDeletingWorkspace,
  } = useWorkspace();

  const { selectedOrganizationId } = useOrganization();

  // Filter workspaces based on selected organization
  const filteredWorkspaces = createMemo(() => {
    const allWorkspaces = workspaces();
    const orgId = selectedOrganizationId();

    if (!allWorkspaces || !orgId) return [];

    // Filter workspaces that belong to the selected organization
    return allWorkspaces.filter(
      (workspace) => workspace.organization_id === orgId
    );
  });

  // Workspace signals
  const [showCreateWorkspaceForm, setShowCreateWorkspaceForm] =
    createSignal(false);
  const [editingWorkspaceId, setEditingWorkspaceId] = createSignal<
    number | null
  >(null);
  const [newWorkspaceName, setNewWorkspaceName] = createSignal('');
  const [editWorkspaceName, setEditWorkspaceName] = createSignal('');

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName().trim()) return;

    try {
      const result = await createWorkspace(
        newWorkspaceName().trim(),
        selectedOrganizationId() || 1
      );
      setNewWorkspaceName('');
      setShowCreateWorkspaceForm(false);
      if (result?.id) {
        props.onWorkspaceSelect(result.id);
      }
    } catch (error) {
      console.error('Failed to create workspace:', error);
    }
  };

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

  const startEditingWorkspace = (id: number, name: string) => {
    setEditingWorkspaceId(id);
    setEditWorkspaceName(name);
  };

  const cancelEditingWorkspace = () => {
    setEditingWorkspaceId(null);
    setEditWorkspaceName('');
  };

  return (
    <div class="text-white space-y-6">
      <h3 class="text-xl font-bold">Workspace Management</h3>

      <Show when={!selectedOrganizationId()}>
        <div class="text-yellow-400 text-sm bg-yellow-400/10 p-4 rounded-lg border border-yellow-400/20">
          <div class="font-medium mb-1">Organization Required</div>
          <div>Please select an organization first to manage workspaces.</div>
        </div>
      </Show>

      <Show when={selectedOrganizationId()}>
        {/* Create Workspace Button */}
        <div class="flex justify-end">
          <Button
            variant="ghost"
            class="text-white/80 hover:bg-gray-500/10 hover:text-white"
            onclick={() =>
              setShowCreateWorkspaceForm(!showCreateWorkspaceForm())
            }
            disabled={isCreatingWorkspace()}
          >
            <FiPlus />
            New Workspace
          </Button>
        </div>

        {/* Create Workspace Form */}
        <Show when={showCreateWorkspaceForm()}>
          <div class="bg-gray-800/50 p-4 rounded-lg space-y-3">
            <h4 class="font-medium">Create New Workspace</h4>
            <div class="flex gap-2">
              <input
                type="text"
                placeholder="Workspace name"
                class="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                value={newWorkspaceName()}
                onInput={(e) => setNewWorkspaceName(e.currentTarget.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleCreateWorkspace();
                  if (e.key === 'Escape') setShowCreateWorkspaceForm(false);
                }}
              />
              <Button
                variant="default"
                onclick={handleCreateWorkspace}
                disabled={isCreatingWorkspace() || !newWorkspaceName().trim()}
              >
                <FiSave />
                {isCreatingWorkspace() ? 'Creating...' : 'Create'}
              </Button>
              <Button
                variant="ghost"
                onclick={() => {
                  setShowCreateWorkspaceForm(false);
                  setNewWorkspaceName('');
                }}
              >
                <FiX />
                Cancel
              </Button>
            </div>
          </div>
        </Show>

        {/* Workspaces List */}
        <div class="space-y-3">
          <h4 class="font-medium text-gray-300">Your Workspaces</h4>
          <div class="space-y-2">
            <Show
              when={filteredWorkspaces() && filteredWorkspaces().length > 0}
              fallback={
                <div class="text-gray-400 text-sm bg-gray-800/30 p-4 rounded-lg">
                  No workspaces found for this organization. Create your first
                  workspace above.
                </div>
              }
            >
              <For each={filteredWorkspaces()}>
                {(workspace) => (
                  <div class="bg-gray-800/30 p-4 rounded-lg flex items-center justify-between">
                    <Show
                      when={editingWorkspaceId() === workspace.id}
                      fallback={
                        <div class="flex items-center gap-3">
                          <span class="text-white font-medium">
                            {workspace.name}
                          </span>
                          <Show
                            when={props.selectedWorkspaceId() === workspace.id}
                          >
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
                        onInput={(e) =>
                          setEditWorkspaceName(e.currentTarget.value)
                        }
                        onKeyPress={(e) => {
                          if (e.key === 'Enter')
                            handleUpdateWorkspace(workspace.id);
                          if (e.key === 'Escape') cancelEditingWorkspace();
                        }}
                      />
                    </Show>

                    <div class="flex gap-2">
                      <Show
                        when={editingWorkspaceId() === workspace.id}
                        fallback={
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onclick={() =>
                                props.onWorkspaceSelect(workspace.id)
                              }
                              disabled={
                                props.selectedWorkspaceId() === workspace.id
                              }
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
                                startEditingWorkspace(
                                  workspace.id,
                                  workspace.name
                                )
                              }
                              disabled={isUpdatingWorkspace()}
                            >
                              <FiEdit2 size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onclick={() =>
                                handleDeleteWorkspace(workspace.id)
                              }
                              disabled={isDeletingWorkspace()}
                              class="text-red-400 hover:text-red-300"
                            >
                              <FiTrash2 size={16} />
                            </Button>
                          </>
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
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default WorkspaceSettings;
