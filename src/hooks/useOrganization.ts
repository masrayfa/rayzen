import { createSignal, createResource } from 'solid-js';
import { api } from '../rpc';

export function useOrganization() {
  const [selectedOrganizationId, setSelectedOrganizationId] = createSignal<
    number | null
  >(null);
  const [selectedUserId, setSelectedUserId] = createSignal<number | null>(null);

  const [isCreating, setIsCreating] = createSignal(false);
  const [isUpdating, setIsUpdating] = createSignal(false);
  const [isDeleting, setIsDeleting] = createSignal(false);

  const [organization] = createResource(selectedOrganizationId, async () => {
    console.log('🔄 Fetching organization for user:', selectedOrganizationId());
    try {
      const organization = await api.query([
        'organization.getOrganizationById',
        selectedOrganizationId() ?? 0,
      ]);

      return organization;
    } catch (error) {
      console.error('❌ Error getting organization:', error);
      throw error;
    }
  });

  const [organizations] = createResource(async () => {
    try {
      const orgs = await api.query([
        'organization.getOrganizationByUserId',
        selectedUserId() ?? 1,
      ]);
      return orgs;
    } catch (error) {
      console.error('❌ Error getting organizations:', error);
      throw error;
    }
  });

  const createOrganization = async (userId: number, name: string) => {
    try {
      setIsCreating(true);
      console.log('🔄 Creating organization:', { name, userId });

      const result = await api.mutation([
        'organization.createOrganization',
        {
          name,
          user_id: userId,
        },
      ]);

      console.log('✅ Organization created:', result);
      return result;
    } catch (error) {
      console.error('❌ Error creating organization:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateOrganization = async (
    id: number,
    userId: number,
    name: string
  ) => {
    try {
      setIsUpdating(true);
      console.log('🔄 Updating organization:', { id, name });

      const result = await api.mutation([
        'organization.updateOrganization',
        {
          id,
          name,
          user_id: userId,
        },
      ]);

      console.log('✅ Organization updated:', result);
      return result;
    } catch (error) {
      console.error('❌ Error updating organization:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteOrganization = async (id: number) => {
    console.log('🔄 Deleting organization:', id);
    try {
      setIsDeleting(true);
      console.log('🔄 Deleting organization:', id);

      const result = await api.mutation([
        'organization.deleteOrganization',
        id,
      ]);

      console.log('✅ Organization deleted:', result);
      return result;
    } catch (error) {
      console.error('❌ Error deleting organization:', error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  const selectOrganization = (id: number) => {
    console.log('🏢 Selecting workspace:', id);
    setSelectedOrganizationId(id);
  };

  return {
    isCreating,
    isUpdating,
    isDeleting,
    organization,
    organizations,
    selectOrganization,
    selectedOrganizationId,
    selectedUserId,
    setSelectedUserId,
    createOrganization,
    updateOrganization,
    deleteOrganization,
  };
}
