'use client'

import { create } from 'zustand'

interface ChatState {
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useChatState = create<ChatState>((set, get) => ({
  sidebarOpen: false,
  toggleSidebar: () => {
    const { sidebarOpen } = get()
    console.log('💬 [ChatState] Sidebar toggled:', !sidebarOpen)
    set({ sidebarOpen: !sidebarOpen })
  },
  setSidebarOpen: (open) => {
    console.log('💬 [ChatState] Sidebar set:', open)
    set({ sidebarOpen: open })
  },
}))
