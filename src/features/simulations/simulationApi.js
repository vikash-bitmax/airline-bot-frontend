import { baseApi } from '../../services/api.js';

export const simulationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSimulations: builder.query({
      query: (params) => ({
        url: '/simulations',
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ runId }) => ({ type: 'Simulation', id: runId })),
              { type: 'Simulation', id: 'LIST' },
            ]
          : [{ type: 'Simulation', id: 'LIST' }],
    }),
    getSimulationById: builder.query({
      query: (runId) => `/simulations/${runId}`,
      providesTags: (result, error, id) => [{ type: 'Simulation', id }],
    }),
    createSimulation: builder.mutation({
      query: (body) => ({
        url: '/simulations',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Simulation', id: 'LIST' }],
    }),
    startSimulation: builder.mutation({
      query: (runId) => ({
        url: `/simulations/${runId}/start`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, runId) => [
        { type: 'Simulation', id: runId },
        { type: 'Simulation', id: 'LIST' },
      ],
    }),
    pauseSimulation: builder.mutation({
      query: (runId) => ({
        url: `/simulations/${runId}/pause`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, runId) => [{ type: 'Simulation', id: runId }],
    }),
    resumeSimulation: builder.mutation({
      query: (runId) => ({
        url: `/simulations/${runId}/resume`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, runId) => [{ type: 'Simulation', id: runId }],
    }),
    cancelSimulation: builder.mutation({
      query: (runId) => ({
        url: `/simulations/${runId}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, runId) => [
        { type: 'Simulation', id: runId },
        { type: 'Simulation', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetSimulationsQuery,
  useGetSimulationByIdQuery,
  useCreateSimulationMutation,
  useStartSimulationMutation,
  usePauseSimulationMutation,
  useResumeSimulationMutation,
  useCancelSimulationMutation,
} = simulationApi;
