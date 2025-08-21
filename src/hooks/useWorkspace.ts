import { createSignal, createResource } from 'solid-js';
import { api } from '../rpc';

export function useWorkspace() {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = createSignal<
    number | null
  >(null);
  const [selectedOrgId, setSelectedOrgId] = createSignal<number | null>(null);

  const [isCreating, setIsCreating] = createSignal(false);
  const [isUpdating, setIsUpdating] = createSignal(false);
  const [isDeleting, setIsDeleting] = createSignal(false);

  const [workspaces, { refetch: refetchWorkspaces }] = createResource(
    selectedOrgId, // Gunakan selectedOrgId sebagai dependency
    async (orgId) => {
      if (!orgId) {
        console.log('No organization ID, skipping workspace fetch');
        return [];
      }

      try {
        console.log('🔄 Fetching workspaces for organization:', orgId);

        const workspaces = await api.query(['workspace.getWorkspaces', orgId]);

        console.log('✅ Workspaces fetched:', workspaces);

        return workspaces;
      } catch (error) {
        console.error('❌ Error getting workspaces:', error);
        throw error;
      }
    }
  );

  const createWorkspace = async (name: string, organizationId: number) => {
    try {
      setIsCreating(true);
      console.log('🔄 Creating workspace:', { name, organizationId });

      const result = await api.mutation([
        'workspace.createWorkspace',
        {
          name,
          organization_id: organizationId,
        },
      ]);

      console.log('✅ Workspace created:', result);

      refetchWorkspaces();

      return result;
    } catch (error) {
      console.error('❌ Error creating workspace:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateWorkspace = async (
    id: number,
    name: string,
    organizationId: number
  ) => {
    try {
      setIsUpdating(true);
      console.log('🔄 Updating workspace:', { id, name, organizationId });

      const result = await api.mutation([
        'workspace.updateWorkspace',
        {
          id,
          name,
          organization_id: organizationId,
        },
      ]);

      console.log('✅ Workspace updated:', result);

      refetchWorkspaces();

      return result;
    } catch (error) {
      console.error('❌ Error updating workspace:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteWorkspace = async (id: number) => {
    try {
      setIsDeleting(true);
      console.log('🔄 Deleting workspace:', id);

      const result = await api.mutation(['workspace.deleteWorkspace', id]);

      console.log('✅ Workspace deleted:', result);

      refetchWorkspaces();

      return result;
    } catch (error) {
      console.error('❌ Error deleting workspace:', error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  const selectWorkspace = (id: number) => {
    console.log('🏢 Selecting workspace:', id);
    setSelectedWorkspaceId(id);
    refetchWorkspaces();
  };

  return {
    isCreating,
    isUpdating,
    isDeleting,
    workspaces,
    selectedOrgId,
    setSelectedOrgId,
    selectWorkspace,
    selectedWorkspaceId,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    refetchWorkspaces,
    setSelectedWorkspaceId,
  };
}
