import { createSignal, createResource } from 'solid-js';
import { api } from '../rpc';
import { GroupsDto } from '~/types';

export function useGroups() {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = createSignal<
    number | null
  >(null);
  const [selectedOrganizationId, setSelectedOrganizationId] = createSignal<
    number | null
  >(null);
  const [selectedGroup, setSelectedGroup] = createSignal<GroupsDto | null>(
    null
  );
  const [isCreating, setIsCreating] = createSignal(false);
  const [isUpdating, setIsUpdating] = createSignal(false);
  const [isDeleting, setIsDeleting] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  // Updated groups resource to handle null workspace
  const [groups, { refetch: refetchGroups }] = createResource(
    () => ({
      workspaceId: selectedWorkspaceId(),
      organizationId: selectedOrganizationId(),
    }),
    async ({ workspaceId, organizationId }) => {
      setLoading(true);
      setError(null);
      // If no workspace selected, return empty array
      if (!workspaceId || !organizationId) {
        console.log(
          'ℹ️ No workspace or organization selected, returning empty groups'
        );
        return [];
      }

      try {
        console.log('🔄 Fetching groups for workspace:', workspaceId);
        const groups = await api.query([
          'groups.getBelongedGroups',
          [workspaceId, organizationId],
        ]);
        console.log('✅ Groups fetched:', groups);
        setLoading(false);
        return groups;
      } catch (error) {
        console.error('❌ Error getting groups:', error);
        setError(
          error instanceof Error ? error.message : 'Failed to fetch groups'
        );
        throw error;
      }
    }
  );

  const createGroup = async () => {
    const workspaceId = selectedWorkspaceId();
    if (!workspaceId) {
      console.error('❌ Cannot create group: No workspace selected');
      throw new Error('No workspace selected');
    }

    try {
      setIsCreating(true);
      console.log('🔄 Creating group for workspace:', workspaceId);
      const result = await api.mutation([
        'groups.createGroups',
        {
          name: 'New Group',
          workspace_id: workspaceId,
        },
      ]);
      console.log('✅ Group created:', result);
      refetchGroups();
      return result;
    } catch (error) {
      console.error('❌ Error creating group:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to create groups'
      );
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateGroup = async (id: number, name: string, workspaceId: number) => {
    try {
      setIsUpdating(true);
      console.log('🔄 Updating group:', { id, name, workspaceId });
      const result = await api.mutation([
        'groups.updateGroup',
        {
          id,
          name,
          workspace_id: workspaceId,
        },
      ]);
      console.log('✅ Group updated:', result);
      refetchGroups();
      return result;
    } catch (error) {
      console.error('❌ Error updating group:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to update groups'
      );
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteGroup = async (id: number) => {
    try {
      setIsDeleting(true);
      console.log('🔄 Deleting group:', id);
      const result = await api.mutation(['groups.deleteGroup', id]);
      console.log('✅ Group deleted:', result);
      refetchGroups();
      return result;
    } catch (error) {
      console.error('❌ Error deleting group:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to delete groups'
      );
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  const selectWorkspace = (id: number | null) => {
    console.log('🏢 Selecting workspace for groups:', id);
    setSelectedWorkspaceId(id);
    // Clear selected group when switching workspace
    setSelectedGroup(null);
  };

  const selectOrganization = (id: number | null) => {
    console.log('🏢 Selecting organization for groups:', id);
    setSelectedOrganizationId(id);
    // Clear selected group when switching organization
    setSelectedGroup(null);
  };

  return {
    isCreating,
    isUpdating,
    isDeleting,
    groups,
    loading,
    error,
    selectedGroup,
    setSelectedGroup,
    selectWorkspace,
    selectOrganization,
    createGroup,
    updateGroup,
    deleteGroup,
    refetchGroups,
  };
}
