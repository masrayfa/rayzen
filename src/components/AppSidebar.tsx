// components/AppSidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar';
import { A } from '@solidjs/router';
import { createSignal } from 'solid-js';

export function AppSidebar() {
  return (
    <Sidebar class="w-64 border-r border-gray-800 bg-gray-900">
      <SidebarHeader class="p-4 border-b border-gray-800">
        <h2 class="text-lg font-semibold text-white">Bookmark Manager</h2>
      </SidebarHeader>

      <SidebarContent class="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel class="text-gray-400 text-sm font-medium">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent class="mt-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton class="w-full">
                  <A
                    href="/"
                    class="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors"
                    activeClass="bg-gray-800 text-white"
                  >
                    Home
                  </A>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton class="w-full">
                  <A
                    href="/search"
                    class="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors"
                    activeClass="bg-gray-800 text-white"
                  >
                    Search
                  </A>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup class="mt-6">
          <SidebarGroupLabel class="text-gray-400 text-sm font-medium">
            Groups
          </SidebarGroupLabel>
          <SidebarGroupContent class="mt-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton class="w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
                  All Bookmarks
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Dynamic groups will go here */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter class="p-4 border-t border-gray-800 mt-auto">
        <div class="text-xs text-gray-500">
          ↑↓ Navigate • Enter Open • Esc Clear
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
