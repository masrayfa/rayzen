import { createSignal, createResource } from 'solid-js';
import { api } from '../rpc';

export function useGroups() {
  const [workspaceId, setWorkspaceId] = createSignal<number | null>(null);

  const [createGroups] = createResource(workspaceId, async (id) => {
    try {
      const groups = await api.mutation([
        'groups.createGroups',
        { name: 'New Group', workspace_id: id },
      ]);

      console.log('✅ New group created:', groups);
      return groups;
    } catch (error) {
      console.error('❌ Error creating group:', error);
      throw error;
    }
  });

  const selectWorkspace = (id: number) => {
    console.log('🏢 Selecting workspace:', id);
    setWorkspaceId(id);
  };

  return {
    create: () => createGroups(),
    selectWorkspace,
  };
}
