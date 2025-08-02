import { createSignal } from 'solid-js';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

export function SelectWorkspace() {
  const [value, setValue] = createSignal('');

  return (
    <div class="flex absolute right-10 mt-2">
      <Select
        value={value()}
        onChange={setValue}
        options={['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple']}
        placeholder="your workspace"
        itemComponent={(props) => (
          <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
        )}
      >
        <SelectTrigger
          aria-label="Fruit"
          class="w-[180px] text-white border-1 border-gray-500/10"
        >
          <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
        </SelectTrigger>
        <SelectContent class="bg-gray-500/10 text-white border-0" />
      </Select>
    </div>
  );
}
