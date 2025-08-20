import { Component } from 'solid-js';
import { Button } from './ui/button';
import { FiX } from 'solid-icons/fi';
import OrganizationSettings from './OrganizationSettings';
import WorkspaceSettings from './WorkspaceSettings';

interface SettingsProps {
  selectedWorkspaceId: () => number | null;
  onWorkspaceSelect: (id: number) => void;
  onDeleteWorkspace: (id: number) => void;
  onClose: () => void;
}

const Settings: Component<SettingsProps> = (props) => {
  return (
    <div class="text-white space-y-8">
      {/* Header with close button */}
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">Settings</h2>
        <Button
          variant="ghost"
          size="sm"
          onclick={props.onClose}
          class="text-gray-400 hover:text-white"
        >
          <FiX size={20} />
        </Button>
      </div>

      {/* Organization Settings Section */}
      <div class="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50">
        <OrganizationSettings />
      </div>

      {/* Workspace Settings Section */}
      <div class="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50">
        <WorkspaceSettings
          selectedWorkspaceId={props.selectedWorkspaceId}
          onWorkspaceSelect={props.onWorkspaceSelect}
          onDeleteWorkspace={props.onDeleteWorkspace}
        />
      </div>
    </div>
  );
};

export default Settings;
