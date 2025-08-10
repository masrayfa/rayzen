import { HiSolidMagnifyingGlass } from 'solid-icons/hi';
import { FiArrowLeft } from 'solid-icons/fi';
import { Component, createSignal, onMount } from 'solid-js';

interface SearchInputProps {
  onSearch: (query: string) => void;
  onNavigate?: (direction: 'up' | 'down') => void;
  onEnter?: () => void;
  onBack?: () => void; // Callback untuk kembali ke groups
  placeholder?: string;
  showBackButton?: boolean; // Untuk menampilkan tombol back
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
        if (query()) {
          // Jika ada query, clear dulu
          setQuery('');
          props.onSearch('');
        } else {
          // Jika tidak ada query, trigger back
          props.onBack?.();
        }
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

  const handleBackClick = () => {
    setQuery('');
    props.onSearch('');
    props.onBack?.();
  };

  return (
    <div class="relative w-full">
      {/* Back Button - hanya tampil jika showBackButton true */}
      {props.showBackButton && (
        <button
          onClick={handleBackClick}
          class="absolute inset-y-0 left-0 pl-4 flex items-center hover:text-blue-400 transition-colors z-10"
        >
          <FiArrowLeft size={18} class="text-gray-400 hover:text-white" />
        </button>
      )}

      {/* Search Icon */}
      <div
        class={`absolute inset-y-0 flex items-center pointer-events-none ${
          props.showBackButton ? 'left-12' : 'left-0 pl-4'
        }`}
      >
        <HiSolidMagnifyingGlass size={18} color="white" />
      </div>

      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        value={query()}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={props.placeholder || 'Search bookmarks, groups...'}
        class={`w-full pr-4 py-4 text-lg text-white placeholder-gray-400 bg-transparent border-b border-white/10 outline-none focus:ring-0 focus:outline-none focus:border-white/30 transition-colors ${
          props.showBackButton ? 'pl-16' : 'pl-12'
        }`}
      />
    </div>
  );
};
