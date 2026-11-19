import { baseApi } from '../../services/api.js';

export const conversationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (params) => ({
        url: '/conversations',
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ conversationId }) => ({
                type: 'Conversation',
                id: conversationId,
              })),
              { type: 'Conversation', id: 'LIST' },
            ]
          : [{ type: 'Conversation', id: 'LIST' }],
    }),
    getConversationDetails: builder.query({
      query: (conversationId) => `/conversations/${conversationId}`,
      providesTags: (result, error, id) => [{ type: 'Conversation', id }],
    }),
    getConversationMessages: builder.query({
      query: (conversationId) => `/conversations/${conversationId}/messages`,
      providesTags: (result, error, id) => [{ type: 'Conversation', id: `${id}-MESSAGES` }],
    }),
    getConversationEvents: builder.query({
      query: (conversationId) => `/conversations/${conversationId}/events`,
      providesTags: (result, error, id) => [{ type: 'Conversation', id: `${id}-EVENTS` }],
    }),
    getConversationReplay: builder.query({
      query: (conversationId) => `/conversations/${conversationId}/replay`,
      providesTags: (result, error, id) => [{ type: 'Conversation', id: `${id}-REPLAY` }],
    }),
    getConversationQcReport: builder.query({
      query: (conversationId) => `/conversations/${conversationId}/qc`,
      providesTags: (result, error, id) => [{ type: 'Conversation', id: `${id}-QC` }],
    }),
    stopConversation: builder.mutation({
      query: (conversationId) => ({
        url: `/conversations/${conversationId}/stop`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Conversation', id },
        { type: 'Conversation', id: 'LIST' },
      ],
    }),
    stopAllConversations: builder.mutation({
      query: () => ({
        url: '/conversations/stop-all',
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Conversation', id: 'LIST' }],
    }),
    deleteConversation: builder.mutation({
      query: (conversationId) => ({
        url: `/conversations/${conversationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Conversation', id },
        { type: 'Conversation', id: 'LIST' },
        { type: 'Simulation', id: 'LIST' },
      ],
    }),
    raiseSupportQuery: builder.mutation({
      query: (body) => ({
        url: '/conversations/raise-query',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Conversation', id: 'LIST' },
        { type: 'Simulation', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationDetailsQuery,
  useGetConversationMessagesQuery,
  useGetConversationEventsQuery,
  useGetConversationReplayQuery,
  useGetConversationQcReportQuery,
  useStopConversationMutation,
  useStopAllConversationsMutation,
  useDeleteConversationMutation,
  useRaiseSupportQueryMutation,
} = conversationApi;
