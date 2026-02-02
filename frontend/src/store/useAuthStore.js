import { create } from 'zustand';

const useAuthStore = create((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => {
        localStorage.clear();
        set({ user: null });
    }
}));

export default useAuthStore;
