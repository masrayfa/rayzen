export interface SearchResult {
  id: number;
  title: string;
  url?: string;
  type: 'bookmark' | 'group' | 'workspace' | 'organization';
  tags?: string;
  is_favorite?: boolean;
}
