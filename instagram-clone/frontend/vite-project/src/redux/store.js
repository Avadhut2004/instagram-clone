import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice.js';
import PostSlice from './postSlice.js';
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';


// Define rootReducer first
const rootReducer = combineReducers({
    auth: authSlice,
    post: PostSlice
});

// Persist configuration
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};

// Apply persistReducer AFTER defining rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export default store;
