import { createEffect, createSignal } from 'solid-js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

interface SelectOptionsProps {
  options: {
    name: string;
    id: number;
  }[];
  defaultValue?: string;
  placeholder?: string;
  onSelect?: (id: number) => void;
  selectedId?: number; // Simplified to just one selected ID
  class?: string;
  type?: 'organization' | 'workspace' | 'bookmark';
}

export function SelectOptions(props: SelectOptionsProps) {
  const [value, setValue] = createSignal('');

  // Process options to extract names for Select component
  const selectOptions = () => props.options.map((option) => option.name);

  createEffect(() => {
    console.log(
      `SelectOptions effect of ${props.type} - options: ${props.options}`
    );
    console.log(`SelectOptions effect ${props.type} - selectedId:`);

    // Handle null/undefined selectedId
    if (props.selectedId == null) {
      setValue('');
      return;
    }

    if (props.options.length > 0 && props.selectedId !== null) {
      const selectedOption = props.options.find(
        (opt) => opt.id === props.selectedId
      );

      if (selectedOption && value() !== selectedOption.name) {
        setValue(selectedOption.name);
      }
    } else if (props.options.length > 0 && props.selectedId === null) {
      // Auto-select first option jika tidak ada selectedId
      const firstOption = props.options[0];
      setValue(firstOption.name);
      props.onSelect?.(firstOption.id);
    }
  });

  const handleChange = (selectedName: string | null) => {
    console.log('SelectOptions handleChange:', selectedName);

    if (!selectedName) return;

    setValue(selectedName);

    // Find the option by name and call onSelect with the ID
    const selectedOption = props.options.find(
      (opt) => opt.name === selectedName
    );

    console.log('Selected option found:', selectedOption);

    if (selectedOption) {
      props.onSelect?.(selectedOption.id);
    }
  };

  return (
    <div class={props.class || 'flex'}>
      <Select
        value={value()}
        onChange={handleChange}
        options={selectOptions()}
        placeholder={props.placeholder || 'Select option'}
        itemComponent={(itemProps) => (
          <SelectItem item={itemProps.item}>
            {itemProps.item.rawValue}
          </SelectItem>
        )}
      >
        <SelectTrigger
          aria-label={props.placeholder || 'Select'}
          class="w-[180px] text-white border-1 border-gray-500/10"
        >
          <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
        </SelectTrigger>
        <SelectContent class="bg-gray-500/10 text-white border-0" />
      </Select>
    </div>
  );
}
