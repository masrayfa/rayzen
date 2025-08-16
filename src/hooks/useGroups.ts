import { createSignal } from 'solid-js';
import { api } from '../rpc';

export function useGroups() {
  const [workspaceId, setWorkspaceId] = createSignal<number | null>(null);
  const [isCreating, setIsCreating] = createSignal(false);
  const [isUpdating, setIsUpdating] = createSignal(false);

  const createGroup = async (name: string = 'New Group') => {
    const currentWorkspaceId = workspaceId();
    if (!currentWorkspaceId) {
      console.error('❌ No workspace selected');
      return null;
    }

    try {
      setIsCreating(true);
      const newGroup = await api.mutation([
        'groups.createGroups',
        { name, workspace_id: currentWorkspaceId },
      ]);
      console.log('✅ New group created:', newGroup);
      return newGroup;
    } catch (error) {
      console.error('❌ Error creating group:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateGroup = async (
    groupId: number,
    name: string,
    workspaceId: number
  ) => {
    try {
      setIsUpdating(true);
      console.log('📡 Sending update request:', {
        id: groupId,
        name,
        workspace_id: workspaceId,
      });

      const updatedGroup = await api.mutation([
        'groups.updateGroup',
        { id: groupId, name, workspace_id: workspaceId },
      ]);

      console.log('✅ Group updated - backend response:', updatedGroup);
      return updatedGroup;
    } catch (error) {
      console.error('❌ Error updating group:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteGroup = async (groupId: number) => {
    try {
      await api.mutation(['groups.deleteGroup', groupId]);
      console.log('✅ Group deleted:', groupId);
      return true;
    } catch (error) {
      console.error('❌ Error deleting group:', error);
      throw error;
    }
  };

  const selectWorkspace = (id: number) => {
    console.log('🏢 Selecting workspace:', id);
    setWorkspaceId(id);
  };

  return {
    // State
    workspaceId: workspaceId(),
    isCreating,
    isUpdating,

    // Actions
    selectWorkspace,
    createGroup,
    updateGroup,
    deleteGroup,
  };
}
// import { createSignal } from 'solid-js';
// import { api } from '../rpc';

// export function useGroups() {
//   const [workspaceId, setWorkspaceId] = createSignal<number | null>(null);
//   const [isCreating, setIsCreating] = createSignal(false);
//   const [isUpdating, setIsUpdating] = createSignal(false);

//   const createGroup = async (name: string = 'New Group') => {
//     const currentWorkspaceId = workspaceId();
//     if (!currentWorkspaceId) {
//       console.error('❌ No workspace selected');
//       return null;
//     }

//     try {
//       setIsCreating(true);
//       const newGroup = await api.mutation([
//         'groups.createGroups',
//         { name, workspace_id: currentWorkspaceId },
//       ]);
//       console.log('✅ New group created:', newGroup);
//       return newGroup;
//     } catch (error) {
//       console.error('❌ Error creating group:', error);
//       throw error;
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   const updateGroup = async (
//     groupId: number,
//     name: string,
//     workspaceId: number
//   ) => {
//     if (!workspaceId) {
//       console.error('❌ No workspace selected');
//       return null;
//     }

//     try {
//       setIsUpdating(true);
//       const updatedGroup = await api.mutation([
//         'groups.updateGroup',
//         { id: groupId, name, workspace_id: workspaceId },
//       ]);
//       console.log('✅ Group updated:', updatedGroup);
//       return updatedGroup;
//     } catch (error) {
//       console.error('❌ Error updating group:', error);
//       throw error;
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const deleteGroup = async (groupId: number) => {
//     try {
//       await api.mutation(['groups.deleteGroup', groupId]);
//       console.log('✅ Group deleted:', groupId);
//       return true;
//     } catch (error) {
//       console.error('❌ Error deleting group:', error);
//       throw error;
//     }
//   };

//   const selectWorkspace = (id: number) => {
//     console.log('🏢 Selecting workspace:', id);
//     setWorkspaceId(id);
//   };

//   return {
//     // State
//     workspaceId: workspaceId(),
//     isCreating,
//     isUpdating,

//     // Actions
//     selectWorkspace,
//     createGroup,
//     updateGroup,
//     deleteGroup,
//   };
// }
