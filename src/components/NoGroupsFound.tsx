import { FiFolder } from 'solid-icons/fi';

const NoGroupsFound = () => {
  return (
    <div class="text-center py-13">
      <FiFolder class="mx-auto mb-5 text-4xl text-gray-600" />
      <div class="text-gray-500 text-lg mb-2">No groups found</div>
      <div class="text-gray-600 text-sm">
        Create your first group to organize your bookmarks
      </div>
    </div>
  );
};

export default NoGroupsFound;
