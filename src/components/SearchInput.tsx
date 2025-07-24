import { Component, createSignal, onMount } from 'solid-js';

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchInput: Component<SearchInputProps> = (props) => {
  const [query, setQuery] = createSignal('');
  let inputRef: HTMLInputElement | undefined;

  onMount(() => {
    inputRef?.focus();
  });

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setQuery(value);
    props.onSearch(value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setQuery('');
      props.onSearch('');
    }
  };

  return (
    <div class="relative w-full max-w-2xl mx-auto">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg
          class="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        ref={inputRef}
        type="text"
        value={query()}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={
          props.placeholder || 'Search bookmarks, groups, workspaces...'
        }
        class="w-full pl-12 pr-4 py-4 text-lg bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};

export default SearchInput;
