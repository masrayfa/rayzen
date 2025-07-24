import { createSignal } from 'solid-js/types/server/reactive.js';
import { createResource } from 'solid-js/types/server/rendering.js';
import { api } from '../rpc';

export function useBookmarkSearch() {
  const [searchQuery, setSearchQuery] = createSignal('');

  const [searchResults] = createResource(searchQuery, async (query) => {
    if (!query.trim()) return await api.query(['bookmark.getBookmarkById', 2]);
  });
}
