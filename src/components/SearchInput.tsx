import { HiSolidMagnifyingGlass } from 'solid-icons/hi';
import { Component, createSignal, onMount } from 'solid-js';

interface SearchInputProps {
  onSearch: (query: string) => void;
  onNavigate?: (direction: 'up' | 'down') => void;
  onEnter?: () => void;
  placeholder?: string;
}

export const SearchInput: Component<SearchInputProps> = (props) => {
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
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setQuery('');
        props.onSearch('');
        break;
      case 'ArrowDown':
        e.preventDefault();
        props.onNavigate?.('down');
        break;
      case 'ArrowUp':
        e.preventDefault();
        props.onNavigate?.('up');
        break;
      case 'Enter':
        e.preventDefault();
        props.onEnter?.();
        break;
    }
  };

  return (
    <div class="relative w-full">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <HiSolidMagnifyingGlass size={18} color="white" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={query()}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={props.placeholder || 'Search bookmarks, groups...'}
        class="w-full pl-12 pr-4 py-4 text-lg text-white placeholder-gray-400 border-b border-white/10 outline-none focus:ring-0 focus:outline-none"
      />
    </div>
  );
};
