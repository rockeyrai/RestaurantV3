import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';  // Use localStorage for persistence
import authReducer from './slice/auth';

// Configure persist for the auth reducer
const persistConfig = {
  key: 'auth',
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Create the store with persisted reducer
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  // Add serializableCheck to ignore non-serializable values (redux-persist uses non-serializable actions internally)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'], // Ignore persist actions
        ignoredPaths: ['persist', 'rehydrate'], // Ignore specific paths
      },
    }),
});

export const persistor = persistStore(store);  // Create persistor to be used in PersistGate
