import { createSignal, createResource } from 'solid-js';
import { api } from '../rpc';

export function useWorkspace() {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = createSignal<
    number | null
  >(null);

  const [workspaces] = createResource(async () => {
    try {
      const workspaces = await api.query(['workspace.getWorkspaces']);

      return workspaces;
    } catch (error) {
      console.error('❌ Error getting workspace:', error);
      throw error;
    }
  });

  const selectWorkspace = (id: number) => {
    console.log('🏢 Selecting workspace:', id);
    setSelectedWorkspaceId(id);
  };

  return {
    workspaces,
    selectWorkspace,
    selectedWorkspaceId,
  };
}
