'use client';

import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FRONTEND_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function ClientProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
