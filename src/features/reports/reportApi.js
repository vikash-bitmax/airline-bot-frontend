import { baseApi } from '../../services/api.js';

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSimulationReport: builder.query({
      query: (runId) => `/reports/simulations/${runId}`,
      providesTags: (result, error, id) => [{ type: 'Report', id }],
    }),
    getPersonaReports: builder.query({
      query: () => '/reports/personas',
      providesTags: [{ type: 'Report', id: 'PERSONAS' }],
    }),
    getScenarioReports: builder.query({
      query: () => '/reports/scenarios',
      providesTags: [{ type: 'Report', id: 'SCENARIOS' }],
    }),
  }),
});

export const {
  useGetSimulationReportQuery,
  useGetPersonaReportsQuery,
  useGetScenarioReportsQuery,
} = reportApi;
