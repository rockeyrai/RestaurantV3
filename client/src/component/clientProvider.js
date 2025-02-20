'use client';

import { Provider } from 'react-redux';
import { store, persistor } from '@/redux/store';  // Make sure persistor is imported
import { PersistGate } from 'redux-persist/integration/react';
import axios from 'axios';

// Create Axios instance for API requests
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FRONTEND_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function ClientProvider({ children }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        {children}
      </PersistGate>
    </Provider>
  );
}
