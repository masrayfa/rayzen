import { Component, createEffect, createSignal, For, Show } from 'solid-js';
import { Button } from './ui/button';
import {
  FiCheck,
  FiEdit2,
  FiPlus,
  FiSave,
  FiTrash2,
  FiX,
} from 'solid-icons/fi';
import { WorkspaceDto } from '~/types';

interface SettingsProps {
  selectedWorkspaceId: () => number | null;
  onWorkspaceSelect: (id: number) => void;
  onDeleteWorkspace: (id: number) => void;
  onClose: () => void;
  workspaces: WorkspaceDto[];
  organizations: Array<{ id: number; name: string }>;
  organizationId: number;
  // add props for organization actions
  onCreateOrganization: (name: string) => Promise<any>;
  onUpdateOrganization: (id: number, name: string) => Promise<any>;
  onDeleteOrganization: (id: number) => Promise<any>;
  onSelectOrganization: (id: number) => void;
  isCreatingOrg?: boolean;
  isUpdatingOrg?: boolean;
  isDeletingOrg?: boolean;
}

const Settings: Component<SettingsProps> = (props) => {
  // Workspace signals
  const [editingWorkspaceId, setEditingWorkspaceId] = createSignal<
    number | null
  >(null);
  const [editWorkspaceName, setEditWorkspaceName] = createSignal('');

  // Organization signals
  const [showCreateOrgForm, setShowCreateOrgForm] = createSignal(false);
  const [newOrgName, setNewOrgName] = createSignal('');
  const [editOrgName, setEditOrgName] = createSignal('');
  const [editingOrgId, setEditingOrgId] = createSignal<number | null>(null);

  const handleUpdateWorkspace = async (id: number) => {
    if (!editWorkspaceName().trim()) return;

    try {
      console.log('Update workspace:', id, editWorkspaceName().trim());
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
        props.onDeleteWorkspace(id);
      } catch (error) {
        console.error('Failed to delete workspace:', error);
      }
    }
  };

  const handleCreateOrganization = async () => {
    if (!newOrgName().trim()) return;

    try {
      const result = await props.onCreateOrganization(newOrgName().trim());
      setNewOrgName('');
      setShowCreateOrgForm(false);

      // Auto-select the newly created organization
      if (result?.id) {
        props.onSelectOrganization(result.id);
      }
    } catch (error) {
      console.error('Failed to create organization:', error);
    }
  };

  const handleUpdateOrganization = async (id: number) => {
    if (!editOrgName().trim()) return;

    try {
      await props.onUpdateOrganization(id, editOrgName().trim());
      setEditingOrgId(null);
      setEditOrgName('');
    } catch (error) {
      console.error('Failed to update organization:', error);
    }
  };

  const handleDeleteOrganization = async (id: number) => {
    if (
      confirm(
        'Are you sure you want to delete this organization? This action cannot be undone.'
      )
    ) {
      try {
        await props.onDeleteOrganization(id);

        // If we deleted the currently selected organization, select another one
        if (props.organizationId === id) {
          const remainingOrgs = props.organizations?.filter(
            (org) => org.id !== id
          );
          if (remainingOrgs && remainingOrgs.length > 0) {
            props.onSelectOrganization(remainingOrgs[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to delete organization:', error);
      }
    }
  };

  const cancelEditingOrg = () => {
    setEditingOrgId(null);
    setEditOrgName('');
  };

  const handleOrganizationSelect = (id: number) => {
    console.log('🏢 Organization selected from dropdown:', id);
    props.onSelectOrganization(id);
  };

  const startEditingOrg = (id: number, name: string) => {
    setEditingOrgId(id);
    setEditOrgName(name);
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
      <div class="text-white space-y-6">
        <h3 class="text-xl font-bold">Organization Management</h3>

        {/* Create Organization Button */}
        <div class="flex justify-end">
          <Button
            variant="ghost"
            class="text-white/80 hover:bg-gray-500/10 hover:text-white"
            onclick={() => setShowCreateOrgForm(!showCreateOrgForm())}
            disabled={props.isCreatingOrg}
          >
            <FiPlus />
            New Organization
          </Button>
        </div>

        {/* Create Organization Form */}
        <Show when={showCreateOrgForm()}>
          <div class="bg-gray-800/50 p-4 rounded-lg space-y-3">
            <h4 class="font-medium">Create New Organization</h4>
            <div class="flex gap-2">
              <input
                type="text"
                placeholder="Organization name"
                class="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                value={newOrgName()}
                onInput={(e) => setNewOrgName(e.currentTarget.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleCreateOrganization();
                  if (e.key === 'Escape') setShowCreateOrgForm(false);
                }}
              />
              <Button
                variant="default"
                onclick={handleCreateOrganization}
                disabled={props.isCreatingOrg || !newOrgName().trim()}
              >
                <FiSave />
                {props.isCreatingOrg ? 'Creating...' : 'Create'}
              </Button>
              <Button
                variant="ghost"
                onclick={() => {
                  setShowCreateOrgForm(false);
                  setNewOrgName('');
                }}
              >
                <FiX />
                Cancel
              </Button>
            </div>
          </div>
        </Show>

        {/* Organizations List */}
        <div class="space-y-3">
          <h4 class="font-medium text-gray-300">Your Organizations</h4>
          <div class="space-y-2">
            <Show
              when={props.organizations && props.organizations.length > 0}
              fallback={
                <div class="text-gray-400 text-sm bg-gray-800/30 p-4 rounded-lg">
                  No organizations found. Create your first organization above.
                </div>
              }
            >
              <For each={props.organizations}>
                {(org) => (
                  <div class="bg-gray-800/30 p-4 rounded-lg flex items-center justify-between">
                    <Show
                      when={editingOrgId() === org.id}
                      fallback={
                        <div class="flex items-center gap-3">
                          <span class="text-white font-medium">{org.name}</span>
                        </div>
                      }
                    >
                      <input
                        type="text"
                        class="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                        value={editOrgName()}
                        onInput={(e) => setEditOrgName(e.currentTarget.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter')
                            handleUpdateOrganization(org.id);
                          if (e.key === 'Escape') cancelEditingOrg();
                        }}
                      />
                    </Show>

                    <div class="flex gap-2">
                      <Show
                        when={editingOrgId() === org.id}
                        fallback={
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onclick={() => handleOrganizationSelect(org.id)}
                              disabled={props.organizationId === org.id}
                              class={
                                props.organizationId === org.id
                                  ? 'opacity-50'
                                  : 'border-blue-500 text-blue-400 hover:bg-blue-500/10 cursor-pointer'
                              }
                            >
                              {props.organizationId === org.id
                                ? 'Active'
                                : 'Select'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onclick={() => startEditingOrg(org.id, org.name)}
                              disabled={props.isUpdatingOrg}
                            >
                              <FiEdit2 size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onclick={() => handleDeleteOrganization(org.id)}
                              disabled={props.isDeletingOrg}
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
                          onclick={() => handleUpdateOrganization(org.id)}
                          disabled={
                            props.isUpdatingOrg || !editOrgName().trim()
                          }
                        >
                          <FiSave size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onclick={cancelEditingOrg}
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
      </div>

      {/* Workspace Settings Section */}
      <div class="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 space-y-3">
        <h3 class="text-xl font-bold mb-4">Workspace Management</h3>
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
                    <div class="flex gap-2">
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
                      >
                        <FiEdit2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onclick={() => handleDeleteWorkspace(workspace.id)}
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
                    disabled={!editWorkspaceName().trim()}
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
