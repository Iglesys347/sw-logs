import { defineStore } from 'pinia';

export const useStore = defineStore({
    id: 'data',
    state: () => ({
        data: [],
        dataMaxSize: 100
    }),
});