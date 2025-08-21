import { Component, createSignal, Show, For, createEffect } from 'solid-js';
import { Button } from './ui/button';
import { SelectOptions } from './SelectOptions';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'solid-icons/fi';
import { useOrganization } from '../hooks/useOrganization';
import { useWorkspace } from '~/hooks/useWorkspace';

interface OrganizationSettingsProps {
  organizations: Array<{ id: number; name: string }>;
  organizationId: number;
}

const OrganizationSettings: Component<OrganizationSettingsProps> = (props) => {
  const {
    isCreating: isCreatingOrg,
    isUpdating: isUpdatingOrg,
    isDeleting: isDeletingOrg,
    selectedOrganizationId,
    selectOrganization,
    createOrganization,
    updateOrganization,
    deleteOrganization,
  } = useOrganization();

  const { setSelectedOrgId } = useWorkspace();

  // Organization signals
  const [showCreateOrgForm, setShowCreateOrgForm] = createSignal(false);
  const [editingOrgId, setEditingOrgId] = createSignal<number | null>(null);
  const [newOrgName, setNewOrgName] = createSignal('');
  const [editOrgName, setEditOrgName] = createSignal('');

  createEffect(() => {
    const orgId = selectedOrganizationId();

    if (orgId) {
      console.log('refetching workspaces for organization:', orgId);
      setSelectedOrgId(orgId);
    }
  });

  const handleCreateOrganization = async () => {
    if (!newOrgName().trim()) return;

    try {
      // Assuming user ID is 1 for now - replace with actual user ID
      const result = await createOrganization(1, newOrgName().trim());
      setNewOrgName('');
      setShowCreateOrgForm(false);

      // Auto-select the newly created organization
      if (result?.id) {
        selectOrganization(result.id);
      }
    } catch (error) {
      console.error('Failed to create organization:', error);
    }
  };

  const handleUpdateOrganization = async (id: number) => {
    if (!editOrgName().trim()) return;

    try {
      // Assuming user ID is 1 for now - replace with actual user ID
      await updateOrganization(id, 1, editOrgName().trim());
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
        await deleteOrganization(id);

        // If we deleted the currently selected organization, select another one
        if (selectedOrganizationId() === id) {
          const remainingOrgs = props.organizations?.filter(
            (org) => org.id !== id
          );
          if (remainingOrgs && remainingOrgs.length > 0) {
            selectOrganization(remainingOrgs[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to delete organization:', error);
      }
    }
  };

  const handleOrganizationSelect = (id: number, name: string) => {
    console.log('🏢 Organization selected from dropdown:', id);
    selectOrganization(id);
  };

  const startEditingOrg = (id: number, name: string) => {
    setEditingOrgId(id);
    setEditOrgName(name);
  };

  const cancelEditingOrg = () => {
    setEditingOrgId(null);
    setEditOrgName('');
  };

  createEffect(() => {
    const orgId = selectedOrganizationId();
    if (orgId && props.organizations) {
      const selectedOrg = props.organizations!.find((org) => org.id === orgId);
      if (selectedOrg) {
        console.log('🏢 Selected organization:', selectedOrg);
      }
      setEditingOrgId(null); // Reset editing state when organization changes
      setEditOrgName('');
    }
  });

  return (
    <div class="text-white space-y-6">
      <h3 class="text-xl font-bold">Organization Management</h3>

      {/* Create Organization Button */}
      <div class="flex justify-end">
        <Button
          variant="ghost"
          class="text-white/80 hover:bg-gray-500/10 hover:text-white"
          onclick={() => setShowCreateOrgForm(!showCreateOrgForm())}
          disabled={isCreatingOrg()}
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
              disabled={isCreatingOrg() || !newOrgName().trim()}
            >
              <FiSave />
              {isCreatingOrg() ? 'Creating...' : 'Create'}
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
            when={props.organizations && props.organizations!.length > 0}
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
                        if (e.key === 'Enter') handleUpdateOrganization(org.id);
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
                            onclick={() =>
                              handleOrganizationSelect(org.id, org.name)
                            }
                            disabled={props.organizationId === org.id}
                            class={
                              props.organizationId === org.id
                                ? 'opacity-50'
                                : 'border-blue-500 text-blue-400 hover:bg-blue-500/10'
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
                            disabled={isUpdatingOrg()}
                          >
                            <FiEdit2 size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onclick={() => handleDeleteOrganization(org.id)}
                            disabled={isDeletingOrg()}
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
                        disabled={isUpdatingOrg() || !editOrgName().trim()}
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
  );
};

export default OrganizationSettings;
