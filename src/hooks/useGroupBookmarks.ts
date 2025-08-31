import { createSignal, createResource } from 'solid-js';
import { api } from '../rpc';
import { SearchResult } from '../types';

const logstring = '@useGroupBookmarks';

export function useGroupBookmarks() {
  const [selectedGroupId, setSelectedGroupId] = createSignal<number | null>(
    null
  );
  const [workspaceId, setWorkspaceId] = createSignal<number | null>(null);

  // Resource untuk fetch bookmarks berdasarkan group yang dipilih
  const [bookmarks, { refetch }] = createResource(
    selectedGroupId,
    async (groupId) => {
      if (groupId === null) return [];

      console.log('🔍 Fetching bookmarks for group:', groupId);
      try {
        // Sesuaikan dengan API endpoint
        const bookmarks = await api.query(['bookmark.getByGroup', groupId]);
        console.log('✅ Group bookmarks fetched:', bookmarks.length);

        // Transform ke format SearchResult untuk consistency
        return bookmarks.map(
          (bookmark: any): SearchResult => ({
            id: bookmark.id,
            title: bookmark.name || bookmark.title || 'Untitled',
            tags: Array.isArray(bookmark.tags) ? bookmark.tags : [],
            is_favorite: Boolean(bookmark.is_favorite),
            url: bookmark.url || '',
            type: 'bookmark',
          })
        );
      } catch (error) {
        console.error('❌ Error fetching group bookmarks:', error);
        throw error;
      }
    }
  );

  const createBookmark = async (
    name: string,
    url: string,
    groupId: number,
    isFavorite: boolean,
    tags: string
  ) => {
    try {
      const result = await api.mutation([
        'bookmark.create',
        {
          name,
          url,
          group_id: groupId || 0,
          is_favorite: isFavorite,
          tags,
        },
      ]);
      console.log('Created bookmark successfully', result);

      refetch();
    } catch (error) {
      console.error('❌ Error creating group bookmarks:', error);
      throw error;
    }
  };

  const updateBookmark = async (
    id: number,
    groupId: number,
    name?: string,
    isFavorite?: boolean,
    tags?: string,
    url?: string
  ) => {
    try {
      const result = await api.mutation([
        'bookmark.update',
        {
          group_id: groupId,
          id,
          name: name ?? '',
          is_favorite: isFavorite ?? false,
          tags: tags ?? '',
          url: url ?? '',
        },
      ]);

      console.log(`${logstring}::Updated bookmark successfully`, result);

      refetch();
    } catch (error) {
      console.error(`${logstring}::Error updating group bookmarks:`, error);
      throw error;
    }
  };

  const deleteBookmark = async (id: number) => {
    console.log(`${logstring}::delete bookmark`, id);
    try {
      const result = await api.mutation(['bookmark.delete', id]);

      console.log(`${logstring}::Deleted bookmark successfully`, result);

      refetch();
    } catch (error) {
      console.error(`${logstring}::Error deleting bookmark: `, error);
      throw error;
    }
  };

  const selectGroup = (groupId: number) => {
    console.log('📂 Selecting group:', groupId);
    setSelectedGroupId(groupId);
  };

  const clearSelection = () => {
    console.log('🗂️ Clearing group selection');
    setSelectedGroupId(null);
  };

  const isGroupSelected = (groupId: number) => {
    return selectedGroupId() === groupId;
  };

  const selectWorkspace = (id: number) => {
    console.log('🏢 Selecting workspace:', id);
    setWorkspaceId(id);
  };

  return {
    selectedGroupId,
    bookmarks,
    selectGroup,
    clearSelection,
    isGroupSelected,
    loading: bookmarks.loading,
    error: bookmarks.error,
    hasBookmarks: () => (bookmarks || []).length > 0,
    createBookmark,
    updateBookmark,
    deleteBookmark,
    selectWorkspace,
  };
}
