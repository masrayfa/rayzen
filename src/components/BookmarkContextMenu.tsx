import { FiTrash } from 'solid-icons/fi';
import { HiOutlinePencilSquare } from 'solid-icons/hi';
import { createSignal, JSXElement } from 'solid-js';

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuGroupLabel,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '~/components/ui/context-menu';

interface BookmarkContextMenu {
  children: JSXElement;
}

export function BookmarkContextMenu(props: BookmarkContextMenu) {
  const [showGitLog, setShowGitLog] = createSignal(true);
  const [showHistory, setShowHistory] = createSignal(false);
  const [branch, setBranch] = createSignal('main');

  return (
    <ContextMenu>
      <ContextMenuTrigger class="">{props.children}</ContextMenuTrigger>
      <ContextMenuPortal>
        <ContextMenuContent class="w-48 outline-0 ">
          <ContextMenuItem class="flex justify-between ">
            <span>Rename</span>
            <HiOutlinePencilSquare />
          </ContextMenuItem>
          <ContextMenuItem class="flex justify-between">
            <span>Delete</span>
            <FiTrash />
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenuPortal>
    </ContextMenu>
  );
}
