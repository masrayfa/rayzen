import { createEffect, createSignal } from 'solid-js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

interface SelectWorkspaceProps {
  options: {
    name: string;
    id: number;
  }[];
  onSelect?: (workspaceId: number) => void;
  selectedWorkspaceId?: number;
}

export function SelectWorkspace(props: SelectWorkspaceProps) {
  const [value, setValue] = createSignal('');

  // Process options to extract names for Select component
  const selectOptions = () => props.options.map((option) => option.name);

  // Set initial value and sync with selectedWorkspaceId prop
  createEffect(() => {
    if (props.options.length > 0) {
      if (props.selectedWorkspaceId) {
        // If there's a selected workspace ID, find its name and set it
        const workspace = props.options.find(
          (opt) => opt.id === props.selectedWorkspaceId
        );
        if (workspace && value() !== workspace.name) {
          setValue(workspace.name);
        }
      }
    }
  });

  const handleChange = (selectedName: string | null) => {
    if (!selectedName) return; // Handle null case

    setValue(selectedName);
    // Find the workspace by name and call onSelect with the ID
    const selectedWorkspace = props.options.find(
      (opt) => opt.name === selectedName
    );
    if (selectedWorkspace) {
      props.onSelect?.(selectedWorkspace.id);
    }
  };

  return (
    <div class="flex absolute right-10 top-0 mt-2">
      <Select
        value={value()}
        onChange={handleChange}
        options={selectOptions()}
        placeholder="your workspace"
        itemComponent={(props) => (
          <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
        )}
      >
        <SelectTrigger
          aria-label="Workspace"
          class="w-[180px] text-white border-1 border-gray-500/10"
        >
          <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
        </SelectTrigger>
        <SelectContent class="bg-gray-500/10 text-white border-0" />
      </Select>
    </div>
  );
}
// import { createEffect } from 'solid-js';
// import { createSignal } from 'solid-js';

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '~/components/ui/select';

// interface SelectWorkspaceProps {
//   options: {
//     name: string;
//     id: number;
//   }[];
//   onSelect?: (workspaceId: number) => void;
//   selectedWorkspaceId?: number;
// }

// export function SelectWorkspace(props: SelectWorkspaceProps) {
//   const [value, setValue] = createSignal('');

//   const selectOptions = props.options.map((option) => option.name);

//   createEffect(() => {
//     if (props.options.length > 0 && !value()) {
//       const workspace = props.options.find(
//         (opt) => opt.id === props.selectedWorkspaceId
//       );
//       props.onSelect?.(workspace?.id ?? 0);
//     }
//   });

//   return (
//     <div class="flex absolute right-10 mt-2">
//       <Select
//         value={value()}
//         onChange={setValue}
//         options={props.options}
//         placeholder="your workspace"
//         itemComponent={(props) => (
//           <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
//         )}
//       >
//         <SelectTrigger
//           aria-label="Fruit"
//           class="w-[180px] text-white border-1 border-gray-500/10"
//         >
//           <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
//         </SelectTrigger>
//         <SelectContent class="bg-gray-500/10 text-white border-0" />
//       </Select>
//     </div>
//   );
// }
