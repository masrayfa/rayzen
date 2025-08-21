import { createSignal } from 'solid-js';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { TextField, TextFieldInput, TextFieldLabel } from './ui/text-field';
import { SelectOptions } from './SelectOptions';

interface CreateBookmarkSheetProps {
  options: {
    name: string;
    id: number;
  }[];
  selectedGroupId?: number;
  onSubmit: (name: string, link: string, selectedGroupId: number) => void;
}

const CreateBookmarkSheet = (props: CreateBookmarkSheetProps) => {
  const [name, setName] = createSignal('');
  const [link, setLink] = createSignal('');
  const [selectedGroupId, setSelectedGroupId] = createSignal<number>(
    props.selectedGroupId || 0
  );
  const [isOpen, setIsOpen] = createSignal(false);

  const handleGroupSelect = (groupId: number) => {
    console.log('Group selected in CreateBookmarkSheet:', groupId);
    setSelectedGroupId(groupId);
  };

  const handleSubmit = (e?: Event) => {
    e?.preventDefault();

    console.log('🔄 Form submitted with:', {
      name: name(),
      link: link(),
      selectedGroupId: selectedGroupId(),
    });

    const nameValue = name().trim();
    const linkValue = link().trim();
    const groupId = selectedGroupId();

    if (!nameValue || !linkValue) {
      console.warn('❌ Name or link is empty');
      return;
    }

    if (!groupId) {
      console.warn('❌ No group selected');
      return;
    }

    console.log('✅ Calling props.onSubmit with:', {
      nameValue,
      linkValue,
      groupId,
    });
    props.onSubmit(nameValue, linkValue, groupId);

    // Reset form and close sheet
    setName('');
    setLink('');
    setSelectedGroupId(0);
    setIsOpen(false);
  };

  const handleButtonClick = () => {
    console.log('🔄 Button clicked, handling submit...');
    handleSubmit();
  };

  return (
    <div>
      <Sheet open={isOpen()} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Button class="bg-gray-500/10 text-white hover:bg-gray-500/20">
            Create Bookmark
          </Button>
        </SheetTrigger>
        <SheetContent position="right">
          <SheetHeader>
            <SheetTitle>New Bookmark</SheetTitle>
            <SheetDescription>
              Create a new bookmark to save your favorite links and resources.
            </SheetDescription>
          </SheetHeader>

          <div class="grid gap-4 py-4">
            <TextField class="grid grid-cols-4 items-center gap-4">
              <TextFieldLabel class="text-right">Name</TextFieldLabel>
              <TextFieldInput
                value={name()}
                placeholder="Stream Manchester United matches"
                class="col-span-3"
                type="text"
                onInput={(e) => setName(e.currentTarget.value)}
              />
            </TextField>

            <TextField class="grid grid-cols-4 items-center gap-4">
              <TextFieldLabel class="text-right">Link</TextFieldLabel>
              <TextFieldInput
                value={link()}
                placeholder="https://www.example.com/stream-manchester-united"
                class="col-span-3"
                type="url"
                onInput={(e) => setLink(e.currentTarget.value)}
              />
            </TextField>

            <div class="grid grid-cols-4 items-center gap-4">
              <label class="text-right text-sm">Group</label>
              <div class="col-span-3">
                <SelectOptions
                  placeholder="Select Group"
                  options={props.options}
                  onSelect={handleGroupSelect}
                  selectedId={selectedGroupId()}
                  class="w-full"
                  type="bookmark"
                />
              </div>
            </div>
          </div>

          <SheetFooter>
            <Button
              type="button"
              onClick={handleButtonClick}
              disabled={!selectedGroupId()}
            >
              Save Changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CreateBookmarkSheet;
