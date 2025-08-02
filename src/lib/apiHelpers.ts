import { GroupsDto } from '~/types';
import { api } from '../rpc';

export class ApiDataProcessor {
  static safeJsonParse<T>(data: any, fallback: T): T {
    try {
      if (typeof data === 'string') {
        return JSON.parse(data);
      }
      return data || fallback;
    } catch {
      return fallback;
    }
  }

  static transformGroups(rawGroups: any[]): GroupsDto[] {
    if (!Array.isArray(rawGroups)) return [];

    return rawGroups.map((group) => ({
      id: Number(group.id) || 0,
      name: String(group.name || ''),
      created_at: String(group.created_at || ''),
      updated_at: String(group.updated_at || ''),
      workspace_id: Number(group.workspace_id) || 0,
    }));
  }

  static formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  }

  static formatDateTime(dateString: string): string {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Invalid date';
    }
  }

  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return function executedFunction(...args: Parameters<T>) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // RSPC-specific helpers
  static async safeQuery<T>(
    queryCall: () => Promise<T>,
    fallback: T,
    errorCallback?: (error: any) => void
  ): Promise<T> {
    try {
      return await queryCall();
    } catch (error) {
      console.error('API Query failed:', error);
      errorCallback?.(error);
      return fallback;
    }
  }

  static createBatchQuery() {
    const queries: Array<() => Promise<any>> = [];

    return {
      add: <T>(queryFn: () => Promise<T>) => {
        queries.push(queryFn);
        return queries.length - 1; // Return index for reference
      },

      execute: async () => {
        try {
          return await Promise.allSettled(queries.map((query) => query()));
        } catch (error) {
          console.error('Batch query failed:', error);
          throw error;
        }
      },

      clear: () => {
        queries.length = 0;
      },
    };
  }

  // Utility for handling RSPC mutations
  static async safeMutation<T>(
    mutationCall: () => Promise<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: any) => void
  ): Promise<T | null> {
    try {
      const result = await mutationCall();
      onSuccess?.(result);
      return result;
    } catch (error) {
      console.error('Mutation failed:', error);
      onError?.(error);
      return null;
    }
  }
}

// RSPC Query Builder - helps with dynamic query construction
export class RSPCQueryBuilder {
  static buildGroupsQuery(workspaceId?: number) {
    return workspaceId
      ? (['groups.getBelongedGroups', workspaceId] as const)
      : (['groups.getAll'] as const);
  }

  static buildBookmarkSearchQuery(query: string) {
    return ['bookmark.searchBookmark', query] as const;
  }

  static buildBookmarksByGroupQuery(groupId: number) {
    return ['bookmark.getByGroup', groupId] as const;
  }

  // Generic query builder
  static build<K extends string, P = undefined>(
    key: K,
    params?: P
  ): P extends undefined ? [K] : [K, P] {
    return params !== undefined ? ([key, params] as any) : ([key] as any);
  }
}

// Error handling utilities
export class RSPCErrorHandler {
  static isNetworkError(error: any): boolean {
    return (
      error?.message?.includes('network') ||
      error?.message?.includes('connection') ||
      error?.code === 'NETWORK_ERROR'
    );
  }

  static isTimeoutError(error: any): boolean {
    return (
      error?.message?.includes('timeout') || error?.code === 'TIMEOUT_ERROR'
    );
  }

  static isAuthError(error: any): boolean {
    return error?.status === 401 || error?.code === 'UNAUTHORIZED';
  }

  static getErrorMessage(error: any): string {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.error) return error.error;
    return 'An unknown error occurred';
  }

  static shouldRetry(error: any): boolean {
    return this.isNetworkError(error) || this.isTimeoutError(error);
  }
}
