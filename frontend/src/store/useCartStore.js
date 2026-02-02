import { create } from 'zustand';

const useCartStore = create((set, get) => ({
    items: [],

    // Загрузка корзины конкретного пользователя
    loadUserCart: (userId) => {
        const saved = localStorage.getItem(`cart_user_${userId}`);
        if (saved) {
            set({ items: JSON.parse(saved) });
        } else {
            set({ items: [] });
        }
    },

    // Сохранение текущей корзины для конкретного пользователя
    syncWithStorage: (userId) => {
        if (userId) {
            localStorage.setItem(`cart_user_${userId}`, JSON.stringify(get().items));
        }
    },

    addToCart: (product, userId) => {
        set((state) => {
            const newItems = [...state.items, product];
            if (userId) localStorage.setItem(`cart_user_${userId}`, JSON.stringify(newItems));
            return { items: newItems };
        });
    },

    clearCart: (userId) => {
        set({ items: [] });
        if (userId) localStorage.removeItem(`cart_user_${userId}`);
    },

    // Сброс состояния в UI (при логауте), но данные в localStorage остаются
    resetUI: () => set({ items: [] })
}));

export default useCartStore;