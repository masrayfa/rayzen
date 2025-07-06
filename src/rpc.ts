import { createClient } from '@rspc/client';
import { TauriTransport } from '@rspc/tauri';

// change "bindings" to be whatever you named your generated bindings
import type { Procedures } from './types/binding';

export const api = createClient<Procedures>({
  transport: new TauriTransport(),
});
