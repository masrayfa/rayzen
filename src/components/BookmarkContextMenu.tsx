import { FiTrash } from 'solid-icons/fi';
import { HiOutlinePencilSquare } from 'solid-icons/hi';
import { createSignal, JSXElement } from 'solid-js';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuTrigger,
} from '~/components/ui/context-menu';

interface BookmarkContextMenuProps {
  children: JSXElement;
  bookmarkId: number;
  bookmarkName: string;
  onRename: (id: number, name: string) => void;
  onDelete: (id: number) => void;
}

export function BookmarkContextMenu(props: BookmarkContextMenuProps) {
  const handleRename = () => {
    const newName = prompt('Enter new bookmark name:', props.bookmarkName);
    if (newName && newName.trim()) {
      props.onRename(props.bookmarkId, newName.trim());
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${props.bookmarkName}"?`)) {
      props.onDelete(props.bookmarkId);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{props.children}</ContextMenuTrigger>
      <ContextMenuPortal>
        <ContextMenuContent class="w-48 outline-0">
          <ContextMenuItem
            class="flex justify-between items-center cursor-pointer"
            onClick={handleRename}
          >
            <span>Rename</span>
            <HiOutlinePencilSquare />
          </ContextMenuItem>
          <ContextMenuItem
            class="flex justify-between items-center cursor-pointer text-red-400 hover:text-red-300"
            onClick={handleDelete}
          >
            <span>Delete</span>
            <FiTrash />
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenuPortal>
    </ContextMenu>
  );
}
