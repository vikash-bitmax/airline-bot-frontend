import { baseApi } from '../../services/api.js';

export const scenarioApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getScenarios: builder.query({
      query: (params) => ({
        url: '/scenarios',
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ scenarioId }) => ({ type: 'Scenario', id: scenarioId })),
              { type: 'Scenario', id: 'LIST' },
            ]
          : [{ type: 'Scenario', id: 'LIST' }],
    }),
    getScenarioById: builder.query({
      query: (scenarioId) => `/scenarios/${scenarioId}`,
      providesTags: (result, error, id) => [{ type: 'Scenario', id }],
    }),
    createScenario: builder.mutation({
      query: (body) => ({
        url: '/scenarios',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Scenario', id: 'LIST' }],
    }),
    updateScenario: builder.mutation({
      query: ({ scenarioId, ...body }) => ({
        url: `/scenarios/${scenarioId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { scenarioId }) => [
        { type: 'Scenario', id: scenarioId },
        { type: 'Scenario', id: 'LIST' },
      ],
    }),
    deleteScenario: builder.mutation({
      query: (scenarioId) => ({
        url: `/scenarios/${scenarioId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Scenario', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetScenariosQuery,
  useGetScenarioByIdQuery,
  useCreateScenarioMutation,
  useUpdateScenarioMutation,
  useDeleteScenarioMutation,
} = scenarioApi;
