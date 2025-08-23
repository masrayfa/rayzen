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
import { FiPlus } from 'solid-icons/fi';

interface CreateWorkspaceSheetProps {
  onSubmit: (name: string, organizationId: number) => void;
  triggerPlaceholder?: string;
}

const CreateWorkspaceSheet = (props: CreateWorkspaceSheetProps) => {
  const [name, setName] = createSignal('');
  const [organizationId, setOrganizationId] = createSignal(0);
  const [isOpen, setIsOpen] = createSignal(false);

  const handleSubmit = (e?: Event) => {
    e?.preventDefault();

    console.log('🔄 Form submitted with:', {
      name: name(),
      description: organizationId(),
    });

    const nameValue = name().trim();
    const organizationValue = organizationId();

    if (!nameValue) {
      console.warn('❌ Workspace name is empty');
      return;
    }

    console.log('✅ Calling props.onSubmit with:', {
      nameValue,
      organizationValue,
    });
    props.onSubmit(nameValue, organizationValue);

    // Reset form and close sheet
    setName('');
    setOrganizationId(0);
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
          <Button class="bg-blue-500/20 text-white rounded-l-none">
            {props.triggerPlaceholder ? props.triggerPlaceholder : null}
            <FiPlus />
          </Button>
        </SheetTrigger>
        <SheetContent position="right">
          <SheetHeader>
            <SheetTitle>New Workspace</SheetTitle>
            <SheetDescription>
              Create a new workspace to organize your bookmarks and groups.
            </SheetDescription>
          </SheetHeader>

          <div class="grid gap-4 py-4">
            <TextField class="grid grid-cols-4 items-center gap-4">
              <TextFieldLabel class="text-right">Name</TextFieldLabel>
              <TextFieldInput
                value={name()}
                placeholder="Personal Projects"
                class="col-span-3"
                type="text"
                onInput={(e) => setName(e.currentTarget.value)}
              />
            </TextField>
          </div>

          <SheetFooter>
            <Button
              type="button"
              onClick={handleButtonClick}
              disabled={!name().trim()}
            >
              Create Workspace
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CreateWorkspaceSheet;
