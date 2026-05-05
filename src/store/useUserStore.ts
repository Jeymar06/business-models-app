import { create } from 'zustand';

type UserProfile = {
  id: string;
  email: string;
  name?: string;
};

type UserStore = {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
