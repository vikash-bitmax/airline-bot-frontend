import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, StopCircle, Radio, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage.jsx';
import StatusBadge from '../common/StatusBadge.jsx';

export const ChatWindow = ({
  conversation,
  messages = [],
  isAgentTyping = false,
  onStop,
  isStopping = false,
}) => {
  const scrollRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
  }, [messages, isAgentTyping, autoScroll]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 40;
    setAutoScroll(isAtBottom);
  };

  const crmChatId = conversation?.crm?.externalConversationId;
  const status = conversation?.status || 'ACTIVE';

  return (
    <div className="flex flex-col h-full rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-sm overflow-hidden">
      {/* Airmail Banner */}
      <div className="airmail-stripe-top" />

      {/* Chat Window Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--surface-ticket-elevated)] border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[var(--text-main)] mono-font">
                {conversation?.conversationId || 'ACTIVE SESSION'}
              </span>
              <StatusBadge status={status} />
            </div>
            {crmChatId && (
              <span className="text-[11px] text-[var(--text-muted)] mono-font">
                CRM Link: <strong className="text-[var(--accent-primary)]">{crmChatId}</strong>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {status === 'ACTIVE' && onStop && (
            <button
              onClick={onStop}
              disabled={isStopping}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 transition-colors mono-font cursor-pointer disabled:opacity-50"
            >
              <StopCircle className="w-3.5 h-3.5" />
              {isStopping ? 'Stopping...' : 'Halt Simulation'}
            </button>
          )}

          {!autoScroll && (
            <button
              onClick={() => {
                setAutoScroll(true);
                scrollToBottom();
              }}
              className="p-1.5 rounded-lg bg-[var(--surface-ticket)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] shadow-2xs"
              title="Jump to latest message"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Message Stream */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 p-4 overflow-y-auto space-y-2 bg-[var(--bg-canvas)]/30"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Radio className="w-8 h-8 text-[var(--accent-primary)] animate-pulse mb-2" />
            <p className="text-xs font-semibold text-[var(--text-muted)] mono-font">
              Initializing customer dispatch session...
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <ChatMessage key={msg.messageId || msg._id || idx} message={msg} />
          ))
        )}

        {isAgentTyping && (
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mono-font px-3 py-2 bg-[var(--surface-ticket)]/80 rounded-lg w-fit border border-[var(--border-subtle)]">
            <span className="w-2 h-2 rounded-full bg-[var(--airmail-blue)] animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-[var(--airmail-blue)] animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-[var(--airmail-blue)] animate-bounce [animation-delay:0.4s]" />
            <span>CRM Agent is typing response...</span>
          </div>
        )}
      </div>

      {/* Chat Footer Telemetry */}
      <div className="px-4 py-2 bg-[var(--surface-ticket-elevated)] border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)] mono-font">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Autonomous LLM Turn Loop Active (Gemini API)
        </span>
        <span>Turns: {conversation?.scenarioProgress?.turnCount || messages.length}</span>
      </div>
    </div>
  );
};

export default ChatWindow;
