import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api/v1';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const token = state.auth?.token || localStorage.getItem('skywings_simulator_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
        headers.set('x-api-key', token);
      }
      return headers;
    },
  }),
  tagTypes: ['Persona', 'Scenario', 'Simulation', 'Conversation', 'Report', 'Dashboard'],
  endpoints: () => ({}),
});
