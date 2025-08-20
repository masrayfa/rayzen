import { Component, createSignal, Show } from 'solid-js';
import { Button } from './ui/button';
import { FiUser, FiArrowRight } from 'solid-icons/fi';
import { api } from '~/rpc';

interface FirstTimeSetupProps {
  onComplete: (userId: number, organizationId: number) => void;
}

const FirstTimeSetup: Component<FirstTimeSetupProps> = (props) => {
  const [currentStep, setCurrentStep] = createSignal<'user' | 'organization'>(
    'user'
  );
  const [userName, setUserName] = createSignal('');
  const [userEmail, setUserEmail] = createSignal('');
  const [organizationName, setOrganizationName] = createSignal('');
  const [isCreatingUser, setIsCreatingUser] = createSignal(false);
  const [isCreatingOrg, setIsCreatingOrg] = createSignal(false);
  const [createdUserId, setCreatedUserId] = createSignal<number | null>(null);

  const handleCreateUser = async () => {
    console.log('Creating user', userName(), userEmail());

    if (!userName().trim() || !userEmail().trim()) return;

    try {
      setIsCreatingUser(true);
      // Replace with actual API call
      const result = await api.mutation([
        'users.createUser',
        { email: userEmail(), name: userName() },
      ]);

      console.log('User created:', result);

      setCreatedUserId(result.id);
      setCurrentStep('organization');
    } catch (error) {
      console.error('Failed to create user:', error);
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleCreateOrganization = async () => {
    if (!organizationName().trim() || !createdUserId()) return;

    try {
      setIsCreatingOrg(true);
      // Replace with actual API call
      const result = await api.mutation([
        'organization.createOrganization',
        { name: organizationName(), user_id: createdUserId() ?? 0 },
      ]);

      console.log('Organization created:', result);

      props.onComplete(createdUserId()!, result.id);
    } catch (error) {
      console.error('Failed to create organization:', error);
    } finally {
      setIsCreatingOrg(false);
    }
  };

  return (
    <div class="h-screen bg-black flex items-center justify-center">
      <div class="max-w-md w-full mx-4">
        <div class="bg-gray-900/80 p-8 rounded-2xl border border-gray-700/50 shadow-2xl">
          {/* Header */}
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-white mb-2">Welcome!</h1>
            <p class="text-gray-400">
              Let's set up your account to get started
            </p>
          </div>

          {/* Progress Steps */}
          <div class="flex items-center justify-center mb-8">
            <div class="flex items-center space-x-4">
              <div
                class={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep() === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                <FiUser size={16} />
              </div>
              <div class="h-px w-8 bg-gray-600"></div>
              <div
                class={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep() === 'organization'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                <FiArrowRight size={16} />
              </div>
            </div>
          </div>

          {/* Step 1: Create User */}
          <Show when={currentStep() === 'user'}>
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-semibold text-white mb-4">
                  Create Your Profile
                </h2>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-400 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      class="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                      value={userName()}
                      onInput={(e) => setUserName(e.currentTarget.value)}
                      onKeyPress={(e) => {
                        if (
                          e.key === 'Enter' &&
                          userName().trim() &&
                          userEmail().trim()
                        ) {
                          handleCreateUser();
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-400 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      class="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                      value={userEmail()}
                      onInput={(e) => setUserEmail(e.currentTarget.value)}
                      onKeyPress={(e) => {
                        if (
                          e.key === 'Enter' &&
                          userName().trim() &&
                          userEmail().trim()
                        ) {
                          handleCreateUser();
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <Button
                class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                onclick={handleCreateUser}
                disabled={
                  isCreatingUser() || !userName().trim() || !userEmail().trim()
                }
              >
                {isCreatingUser() ? (
                  'Creating Profile...'
                ) : (
                  <>
                    Continue
                    <FiArrowRight class="ml-2" />
                  </>
                )}
              </Button>
            </div>
          </Show>

          {/* Step 2: Create Organization */}
          <Show when={currentStep() === 'organization'}>
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-semibold text-white mb-4">
                  Create Your Organization
                </h2>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-400 mb-2">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., My Company, Personal, etc."
                      class="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                      value={organizationName()}
                      onInput={(e) =>
                        setOrganizationName(e.currentTarget.value)
                      }
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && organizationName().trim()) {
                          handleCreateOrganization();
                        }
                      }}
                    />
                  </div>
                  <p class="text-sm text-gray-500">
                    Organizations help you separate different contexts like
                    work, personal projects, or teams.
                  </p>
                </div>
              </div>

              <div class="flex gap-3">
                <Button
                  variant="ghost"
                  class="flex-1 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500"
                  onclick={() => setCurrentStep('user')}
                  disabled={isCreatingOrg()}
                >
                  Back
                </Button>
                <Button
                  class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
                  onclick={handleCreateOrganization}
                  disabled={isCreatingOrg() || !organizationName().trim()}
                >
                  {isCreatingOrg() ? (
                    'Setting up...'
                  ) : (
                    <>
                      Complete Setup
                      <FiArrowRight class="ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default FirstTimeSetup;
