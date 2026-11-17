import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Send, Sparkles, CheckCircle, AlertCircle, Plane } from 'lucide-react';
import { useRaiseSupportQueryMutation } from './conversationApi.js';
import { useGetPersonasQuery } from '../personas/personaApi.js';
import { useGetScenariosQuery } from '../scenarios/scenarioApi.js';

const CATEGORIES = [
  { value: 'FLIGHT_DISRUPTION', label: 'Flight Delay / Disruption / Cancellation' },
  { value: 'BAGGAGE_CLAIM', label: 'Lost / Delayed / Damaged Baggage (PIR)' },
  { value: 'REBOOKING', label: 'Flight Rebooking & Schedule Changes' },
  { value: 'REFUND_DISPUTE', label: 'Ticket Refund & Compensation Dispute' },
  { value: 'SEAT_ALLOCATION', label: 'Seat Selection / Cabin Downgrade' },
  { value: 'SPECIAL_ASSISTANCE', label: 'Medical & Special Airport Assistance' },
  { value: 'GENERAL', label: 'General Flight Information & Support' },
];

export const OnDemandQueryModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [raiseQuery, { isLoading }] = useRaiseSupportQueryMutation();

  const { data: personaData } = useGetPersonasQuery({ limit: 50 });
  const { data: scenarioData } = useGetScenariosQuery({ limit: 50 });

  const personas = personaData?.data || [];
  const scenarios = scenarioData?.data || [];

  const [personaId, setPersonaId] = useState('P001');
  const [scenarioId, setScenarioId] = useState('S001');
  const [customerName, setCustomerName] = useState('Vikash Sharma');
  const [passengerEmail, setPassengerEmail] = useState('vikash.passenger@example.test');
  const [pnr, setPnr] = useState('SW9941');
  const [flightNumber, setFlightNumber] = useState('SW-101');
  const [category, setCategory] = useState('FLIGHT_DISRUPTION');
  const [initialMessage, setInitialMessage] = useState(
    'My flight SW-101 has been delayed by 4 hours. Will I miss my connection, and can I get meal vouchers or rebooking?'
  );
  const [useMockCrm, setUseMockCrm] = useState(false);

  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setResult(null);

    try {
      const res = await raiseQuery({
        personaId,
        scenarioId,
        customerName: customerName.trim(),
        passengerEmail: passengerEmail.trim(),
        pnr: pnr.trim().toUpperCase(),
        flightNumber: flightNumber.trim().toUpperCase(),
        category,
        initialMessage: initialMessage.trim(),
        useMockCrm,
      }).unwrap();

      setResult(res?.data);
    } catch (err) {
      setErrorMsg(err?.data?.message || err.message || 'Failed to raise support query to CRM');
    }
  };

  const handleResetAndClose = () => {
    setResult(null);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-2xl">
        <div className="airmail-stripe-top" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)] bg-[var(--surface-ticket-elevated)]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-[var(--accent-primary)] text-white">
              <Plane className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-main)] mono-font">
                Raise Query to Airline CRM Support
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Direct Bot-to-CRM Support API Trigger (`POST /api/v1/chat/sessions`)
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {result ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-[var(--text-main)] mono-font">
                Inquiry Dispatched to CRM!
              </h4>
              <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
                Customer query was submitted to the CRM backend on <code className="bg-[var(--surface-ticket-elevated)] px-1 py-0.5 rounded">http://localhost:5000/api/v1/chat/sessions</code>. The simulated passenger is now listening on Socket.IO for the agent.
              </p>

              <div className="p-4 rounded-lg bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] text-left mono-font text-xs space-y-1.5 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Conversation ID:</span>
                  <span className="font-bold text-[var(--text-main)]">{result.conversation?.conversationId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">CRM Chat ID:</span>
                  <span className="font-bold text-[var(--accent-primary)]">{result.conversation?.crm?.externalConversationId || 'CHAT-PENDING'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Passenger:</span>
                  <span>{result.conversation?.customerFixture?.facts?.passengerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">PNR & Flight:</span>
                  <span>{result.conversation?.customerFixture?.facts?.pnr} ({result.conversation?.customerFixture?.facts?.flightNumber})</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    handleResetAndClose();
                    navigate(`/conversations/${result.conversation?.conversationId}`);
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white mono-font cursor-pointer"
                >
                  Watch Live Conversation Stream →
                </button>
                <button
                  onClick={() => setResult(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--surface-ticket-elevated)] text-[var(--text-main)] border border-[var(--border-subtle)] mono-font cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Persona and Scenario Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mono-font mb-1">
                    Simulated Persona
                  </label>
                  <select
                    value={personaId}
                    onChange={(e) => setPersonaId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] mono-font"
                  >
                    {personas.map((p) => (
                      <option key={p.personaId} value={p.personaId}>
                        {p.personaId}: {p.name} ({p.archetype || p.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mono-font mb-1">
                    Support Scenario
                  </label>
                  <select
                    value={scenarioId}
                    onChange={(e) => setScenarioId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] mono-font"
                  >
                    {scenarios.map((s) => (
                      <option key={s.scenarioId} value={s.scenarioId}>
                        {s.scenarioId}: {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Passenger Credentials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mono-font mb-1">
                    Passenger Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] mono-font"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mono-font mb-1">
                    Passenger Email
                  </label>
                  <input
                    type="email"
                    required
                    value={passengerEmail}
                    onChange={(e) => setPassengerEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] mono-font"
                  />
                </div>
              </div>

              {/* PNR, Flight Number, Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mono-font mb-1">
                    Booking PNR
                  </label>
                  <input
                    type="text"
                    required
                    value={pnr}
                    onChange={(e) => setPnr(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] mono-font uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mono-font mb-1">
                    Flight Number
                  </label>
                  <input
                    type="text"
                    required
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] mono-font uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mono-font mb-1">
                    CRM Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] mono-font"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Initial Query */}
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mono-font mb-1">
                  Customer Inquiry Message (Initial Opening Turn)
                </label>
                <textarea
                  rows={3}
                  required
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-primary)] leading-relaxed"
                />
              </div>

              {/* Mode switch */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] text-xs mono-font">
                <div>
                  <div className="font-bold text-[var(--text-main)]">Target CRM Environment</div>
                  <div className="text-[10px] text-[var(--text-muted)]">
                    {useMockCrm ? 'Using in-memory Mock CRM agent' : 'Live CRM API at http://localhost:5000'}
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useMockCrm}
                    onChange={(e) => setUseMockCrm(e.target.checked)}
                    className="rounded text-[var(--accent-primary)]"
                  />
                  <span>Mock CRM</span>
                </label>
              </div>

              {/* Footer CTA */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--surface-ticket-elevated)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)] mono-font cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white shadow-sm disabled:opacity-50 transition-colors mono-font cursor-pointer"
                >
                  {isLoading ? (
                    'Dispatching to CRM...'
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      ⚡ Dispatch Inquiry to CRM
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnDemandQueryModal;
