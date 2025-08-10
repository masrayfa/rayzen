import { createSignal, createResource } from 'solid-js';
import { api } from '../rpc';
import { SearchResult } from '../types';

export function useGroupBookmarks() {
  const [selectedGroupId, setSelectedGroupId] = createSignal<number | null>(
    null
  );

  // Resource untuk fetch bookmarks berdasarkan group yang dipilih
  const [groupBookmarks] = createResource(selectedGroupId, async (groupId) => {
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
  });

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

  return {
    selectedGroupId,
    groupBookmarks,
    selectGroup,
    clearSelection,
    isGroupSelected,
    loading: groupBookmarks.loading,
    error: groupBookmarks.error,
    bookmarks: () => groupBookmarks() || [],
    hasBookmarks: () => (groupBookmarks() || []).length > 0,
  };
}
