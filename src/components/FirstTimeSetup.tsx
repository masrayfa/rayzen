import {
  Component,
  createResource,
  createSignal,
  Show,
  onMount,
} from 'solid-js';
import { Button } from './ui/button';
import { FiUser, FiArrowRight } from 'solid-icons/fi';
import { api } from '~/rpc';
import { UserDto } from '~/types';

interface FirstTimeSetupProps {
  onComplete: (userId: number, organizationId: number) => void;
  isFirstTimeForOrg: boolean;
  firstUser?: Pick<UserDto, 'id'>;
}

const FirstTimeSetup: Component<FirstTimeSetupProps> = (props) => {
  const [currentStep, setCurrentStep] = createSignal<'user' | 'organization'>(
    props.isFirstTimeForOrg ? 'organization' : 'user'
  );
  const [userName, setUserName] = createSignal('');
  const [userEmail, setUserEmail] = createSignal('');
  const [organizationName, setOrganizationName] = createSignal('');
  const [isCreatingUser, setIsCreatingUser] = createSignal(false);
  const [isCreatingOrg, setIsCreatingOrg] = createSignal(false);
  const [createdUserId, setCreatedUserId] = createSignal<number | null>(
    props.firstUser?.id || null
  );

  // Setup for organization-only mode
  onMount(async () => {
    console.log('🔄 FirstTimeSetup mounted:', {
      isFirstTimeForOrg: props.isFirstTimeForOrg,
      firstUser: props.firstUser,
    });

    if (props.isFirstTimeForOrg) {
      // if there is firstUser from props, use that
      if (props.firstUser?.id) {
        console.log('✅ Using firstUser from props:', props.firstUser.id);
        setCreatedUserId(props.firstUser.id);
        return;
      }

      // if no, fetch user existing user
      await checkExistingUser();
    }
  });

  const checkExistingUser = async () => {
    try {
      console.log('🔄 Checking existing user...');
      const users = await api.query(['users.getUsers']);
      console.log('✅ Users found:', users);

      if (users && users.length > 0) {
        const firstUser = users[0];
        console.log('✅ Setting user:', firstUser);
        setCreatedUserId(firstUser.id);
        setUserName(firstUser.name);
        setUserEmail(firstUser.email);
      }
    } catch (error) {
      console.error('❌ Error checking existing user:', error);
    }
  };

  const handleCreateUser = async () => {
    console.log('🔄 Creating user', userName(), userEmail());

    if (!userName().trim() || !userEmail().trim()) return;

    try {
      setIsCreatingUser(true);
      const result = await api.mutation([
        'users.createUser',
        { email: userEmail(), name: userName() },
      ]);

      console.log('✅ User created:', result);

      setCreatedUserId(result.id);
      setCurrentStep('organization');
    } catch (error) {
      console.error('❌ Failed to create user:', error);
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleCreateOrganization = async () => {
    console.log('🔄 Creating organization...', {
      organizationName: organizationName(),
      createdUserId: createdUserId(),
      isFirstTimeForOrg: props.isFirstTimeForOrg,
    });

    if (!organizationName().trim()) {
      console.error('❌ Organization name is empty');
      return;
    }

    if (!createdUserId()) {
      console.error('❌ No user ID found');
      return;
    }

    try {
      setIsCreatingOrg(true);
      const result = await api.mutation([
        'organization.createOrganization',
        { name: organizationName(), user_id: createdUserId()! },
      ]);

      console.log('✅ Organization created:', result);
      props.onComplete(createdUserId()!, result.id);
    } catch (error) {
      console.error('❌ Failed to create organization:', error);
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
            <h1 class="text-3xl font-bold text-white mb-2">
              {props.isFirstTimeForOrg ? 'Setup Organization' : 'Welcome!'}
            </h1>
            <p class="text-gray-400">
              {props.isFirstTimeForOrg
                ? 'Create your first organization to continue'
                : "Let's set up your account to get started"}
            </p>
          </div>

          {/* Progress Steps - Hide if only org setup */}
          <Show when={!props.isFirstTimeForOrg}>
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
          </Show>

          {/* Step 1: Create User */}
          <Show when={currentStep() === 'user' && !props.isFirstTimeForOrg}>
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
          <Show
            when={currentStep() === 'organization' || props.isFirstTimeForOrg}
          >
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
                        if (
                          e.key === 'Enter' &&
                          organizationName().trim() &&
                          createdUserId()
                        ) {
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

              {/* Debug info */}
              {/* <div class="text-xs text-gray-600">
                Debug: organizationName="{organizationName()}", createdUserId=
                {createdUserId()}, isCreatingOrg={String(isCreatingOrg())}
              </div> */}

              <div class="flex gap-3">
                {/* Hide back button if isFirstTimeForOrg */}
                <Show when={!props.isFirstTimeForOrg}>
                  <Button
                    variant="ghost"
                    class="flex-1 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500"
                    onclick={() => setCurrentStep('user')}
                    disabled={isCreatingOrg()}
                  >
                    Back
                  </Button>
                </Show>
                <Button
                  class={`${
                    props.isFirstTimeForOrg ? 'w-full' : 'flex-1'
                  } bg-blue-600 hover:bg-blue-700 text-white py-3`}
                  onclick={handleCreateOrganization}
                  disabled={
                    isCreatingOrg() ||
                    !organizationName().trim() ||
                    !createdUserId()
                  }
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
