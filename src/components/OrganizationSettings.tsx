import { Component, createSignal, Show, For } from 'solid-js';
import { Button } from './ui/button';
import { SelectOptions } from './SelectOptions';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'solid-icons/fi';
import { useOrganization } from '../hooks/useOrganization';

interface OrganizationSettingsProps {}

const OrganizationSettings: Component<OrganizationSettingsProps> = () => {
  const {
    organization,
    organizations,
    isCreating: isCreatingOrg,
    isUpdating: isUpdatingOrg,
    isDeleting: isDeletingOrg,
    selectedOrganizationId,
    selectOrganization,
    createOrganization,
    updateOrganization,
    deleteOrganization,
  } = useOrganization();

  // Organization signals
  const [showCreateOrgForm, setShowCreateOrgForm] = createSignal(false);
  const [editingOrgId, setEditingOrgId] = createSignal<number | null>(null);
  const [newOrgName, setNewOrgName] = createSignal('');
  const [editOrgName, setEditOrgName] = createSignal('');

  const handleCreateOrganization = async () => {
    if (!newOrgName().trim()) return;

    try {
      // Assuming user ID is 1 for now - replace with actual user ID
      await createOrganization(1, newOrgName().trim());
      setNewOrgName('');
      setShowCreateOrgForm(false);
      // Refresh organizations list here
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
      // Refresh organizations list here
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
        // Refresh organizations list here
      } catch (error) {
        console.error('Failed to delete organization:', error);
      }
    }
  };

  const startEditingOrg = (id: number, name: string) => {
    setEditingOrgId(id);
    setEditOrgName(name);
  };

  const cancelEditingOrg = () => {
    setEditingOrgId(null);
    setEditOrgName('');
  };

  return (
    <div class="text-white space-y-6">
      <h3 class="text-xl font-bold">Organization Management</h3>

      {/* Active Organization Selector */}
      <div class="space-y-2">
        <label class="text-sm text-gray-400">Active Organization</label>
        <SelectOptions
          placeholder="Select Organization"
          options={(organizations() ?? []).map((org) => ({
            name: org.name,
            id: org.id,
          }))}
          onSelect={selectOrganization}
          selectedId={selectedOrganizationId() ?? 0}
        />
      </div>

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
          <For each={organizations()}>
            {(org) => (
              <div class="bg-gray-800/30 p-4 rounded-lg flex items-center justify-between">
                <Show
                  when={editingOrgId() === org.id}
                  fallback={
                    <div class="flex items-center gap-3">
                      <span class="text-white font-medium">{org.name}</span>
                      <Show when={selectedOrganizationId() === org.id}>
                        <span class="text-xs bg-blue-600 px-2 py-1 rounded font-medium">
                          Active
                        </span>
                      </Show>
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
        </div>
      </div>
    </div>
  );
};

export default OrganizationSettings;
