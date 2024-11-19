import { configureStore } from '@reduxjs/toolkit';
import coinReducer from './slices/coinSlice';

export const store = configureStore({
    reducer: {
        coin: coinReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;