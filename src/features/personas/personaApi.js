import { baseApi } from '../../services/api.js';

export const personaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPersonas: builder.query({
      query: (params) => ({
        url: '/personas',
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ personaId }) => ({ type: 'Persona', id: personaId })),
              { type: 'Persona', id: 'LIST' },
            ]
          : [{ type: 'Persona', id: 'LIST' }],
    }),
    getPersonaById: builder.query({
      query: (personaId) => `/personas/${personaId}`,
      providesTags: (result, error, id) => [{ type: 'Persona', id }],
    }),
    createPersona: builder.mutation({
      query: (body) => ({
        url: '/personas',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Persona', id: 'LIST' }],
    }),
    updatePersona: builder.mutation({
      query: ({ personaId, ...body }) => ({
        url: `/personas/${personaId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { personaId }) => [
        { type: 'Persona', id: personaId },
        { type: 'Persona', id: 'LIST' },
      ],
    }),
    deletePersona: builder.mutation({
      query: (personaId) => ({
        url: `/personas/${personaId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Persona', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetPersonasQuery,
  useGetPersonaByIdQuery,
  useCreatePersonaMutation,
  useUpdatePersonaMutation,
  useDeletePersonaMutation,
} = personaApi;
