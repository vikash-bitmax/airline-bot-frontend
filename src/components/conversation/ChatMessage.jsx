import React from 'react';
import { User, Headphones, Radio, ShieldCheck } from 'lucide-react';

export const ChatMessage = ({ message }) => {
  const isCustomer = message.senderType === 'CUSTOMER' || message.senderRole === 'PASSENGER';
  const isAgent = message.senderType === 'AGENT' || message.senderRole === 'AGENT';
  const isSystem = !isCustomer && !isAgent;

  if (isSystem) {
    return (
      <div className="flex items-center justify-center my-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] mono-font">
          <Radio className="w-3 h-3 text-[var(--accent-primary)] animate-pulse" />
          <span>{message.content || message.text}</span>
        </div>
      </div>
    );
  }

  const timestamp = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '';

  return (
    <div className={`flex gap-3 my-3 ${isCustomer ? 'justify-start' : 'justify-end'}`}>
      {/* Customer Avatar */}
      {isCustomer && (
        <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-xs">
          <User className="w-4 h-4" />
        </div>
      )}

      {/* Message Bubble */}
      <div className={`max-w-[75%] rounded-xl p-3.5 shadow-2xs border ${
        isCustomer
          ? 'bg-[var(--surface-ticket)] border-[var(--border-subtle)] text-[var(--text-main)] rounded-tl-xs'
          : 'bg-[var(--surface-input-active)] border-blue-200 dark:border-blue-800 text-[var(--text-main)] rounded-tr-xs'
      }`}>
        {/* Header line */}
        <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-[var(--border-subtle)]/50 text-[11px] mono-font">
          <span className={`font-bold flex items-center gap-1.5 ${isCustomer ? 'text-[var(--accent-primary)]' : 'text-[var(--airmail-blue)]'}`}>
            {isCustomer ? (
              <>
                <span>AI Passenger ({message.senderId || 'Customer'})</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                  SIM
                </span>
              </>
            ) : (
              <>
                <Headphones className="w-3 h-3" />
                <span>CRM Agent ({message.senderId || 'SkyWings Support'})</span>
              </>
            )}
          </span>
          <span className="text-[var(--text-dim)]">{timestamp}</span>
        </div>

        {/* Message Content */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content || message.text}
        </p>

        {/* AI Intent & Emotion Pills */}
        {isCustomer && (message.intent || message.emotionExpression) && (
          <div className="mt-2.5 pt-1.5 flex items-center gap-2 flex-wrap border-t border-[var(--border-subtle)]/40 text-[10px] mono-font">
            {message.intent && (
              <span className="px-1.5 py-0.5 rounded bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                INTENT: {message.intent}
              </span>
            )}
            {message.emotionExpression && (
              <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-300">
                MOOD: {message.emotionExpression}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Agent Avatar */}
      {isAgent && (
        <div className="w-8 h-8 rounded-full bg-[var(--airmail-blue)] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-xs">
          <Headphones className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
