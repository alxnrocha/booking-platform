import { create } from 'zustand';
import { User, UserRole } from '../types/stayhub.ts';
import { mockUsers } from '../data/mockData.ts';

interface AuthState {
  currentUser: User;
  allUsers: User[];
  setRole: (role: UserRole) => void;
  setUser: (userId: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: mockUsers[0], // Defaults to Guest (Alex Vance)
  allUsers: mockUsers,
  setRole: (role: UserRole) => {
    const matchingUser = mockUsers.find((u) => u.role === role) || mockUsers[0];
    set({ currentUser: matchingUser });
  },
  setUser: (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    if (user) {
      set({ currentUser: user });
    }
  },
}));
