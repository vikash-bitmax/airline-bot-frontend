import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Sliders, User } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import { useCreatePersonaMutation } from './personaApi.js';

export const CreatePersonaPage = () => {
  const navigate = useNavigate();
  const [createPersona, { isLoading }] = useCreatePersonaMutation();

  const [personaId, setPersonaId] = useState(`P${Math.floor(100 + Math.random() * 900)}`);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('FRUSTRATED');
  const [archetype, setArchetype] = useState('');
  const [description, setDescription] = useState('');

  // Behavioral
  const [patience, setPatience] = useState(5);
  const [assertiveness, setAssertiveness] = useState(6);
  const [cooperation, setCooperation] = useState(5);
  const [trust, setTrust] = useState(5);
  const [escalationTendency, setEscalationTendency] = useState(4);

  // Communication
  const [formality, setFormality] = useState('CASUAL');
  const [verbosity, setVerbosity] = useState('MODERATE');
  const [responseDelayMs, setResponseDelayMs] = useState(1500);

  // Baseline
  const [temperament, setTemperament] = useState('ANNOYED');
  const [frustrationSensitivity, setFrustrationSensitivity] = useState(6);

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      await createPersona({
        personaId: personaId.trim().toUpperCase(),
        name: name.trim(),
        category,
        archetype: archetype.trim() || category,
        description: description.trim(),
        behavioralTraits: {
          patience: Number(patience),
          assertiveness: Number(assertiveness),
          cooperation: Number(cooperation),
          trust: Number(trust),
          escalationTendency: Number(escalationTendency),
        },
        communicationStyle: {
          formality,
          verbosity,
          responseDelayMs: Number(responseDelayMs),
          grammarProficiency: 'FLUENT',
        },
        emotionalBaseline: {
          temperament,
          frustrationSensitivity: Number(frustrationSensitivity),
          recoveryRate: 2,
        },
      }).unwrap();

      navigate('/library?tab=personas');
    } catch (err) {
      setErrorMsg(err?.data?.message || err.message || 'Failed to persist persona');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/library?tab=personas')}
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface-ticket)] border border-[var(--border-subtle)] mono-font text-xs flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Library
        </button>
      </div>

      <PageHeader
        title="Create New AI Passenger Persona"
        subtitle="Define behavioral traits, communication quirks, and baseline temperament"
      />

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs mono-font">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font pb-2 border-b border-[var(--border-subtle)]">
            1. Basic Profile & Classification
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mono-font">
            <div>
              <label className="block text-[var(--text-muted)] uppercase mb-1">Persona Identifier</label>
              <input
                type="text"
                required
                value={personaId}
                onChange={(e) => setPersonaId(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] uppercase"
              />
            </div>

            <div>
              <label className="block text-[var(--text-muted)] uppercase mb-1">Full Persona Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Richard Sterling"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
              />
            </div>

            <div>
              <label className="block text-[var(--text-muted)] uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
              >
                <option value="FRUSTRATED">Frustrated / Aggressive</option>
                <option value="ANXIOUS">Anxious / Urgent</option>
                <option value="COOPERATIVE">Cooperative / Calm</option>
                <option value="VIP">VIP / Demanding</option>
                <option value="CONFUSED">Confused / Inexperienced</option>
                <option value="SPECIAL_NEEDS">Special Assistance / Accessibility</option>
                <option value="SKEPTICAL">Skeptical / Analytical</option>
              </select>
            </div>

            <div>
              <label className="block text-[var(--text-muted)] uppercase mb-1">Archetype Label</label>
              <input
                type="text"
                placeholder="e.g. Tight Connection Business Traveler"
                value={archetype}
                onChange={(e) => setArchetype(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase text-[var(--text-muted)] mono-font mb-1">
              Narrative Description & Persona Goals
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe background context, urgency, motivations, and why this passenger behaves this way..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-primary)] leading-relaxed"
            />
          </div>
        </div>

        {/* Section 2: Behavioral Traits */}
        <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font pb-2 border-b border-[var(--border-subtle)]">
            2. Behavioral Dynamics (0 to 10 Sliders)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mono-font">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[var(--text-muted)]">Patience:</span>
                <strong>{patience}/10</strong>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={patience}
                onChange={(e) => setPatience(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[var(--text-muted)]">Assertiveness:</span>
                <strong>{assertiveness}/10</strong>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={assertiveness}
                onChange={(e) => setAssertiveness(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[var(--text-muted)]">Cooperation:</span>
                <strong>{cooperation}/10</strong>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={cooperation}
                onChange={(e) => setCooperation(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[var(--text-muted)]">Escalation Tendency:</span>
                <strong>{escalationTendency}/10</strong>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={escalationTendency}
                onChange={(e) => setEscalationTendency(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Communication & Temperament */}
        <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font pb-2 border-b border-[var(--border-subtle)]">
            3. Communication Style & Baseline Mood
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mono-font">
            <div>
              <label className="block text-[var(--text-muted)] uppercase mb-1">Formality</label>
              <select
                value={formality}
                onChange={(e) => setFormality(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
              >
                <option value="VERY_FORMAL">Very Formal</option>
                <option value="FORMAL">Formal</option>
                <option value="CASUAL">Casual</option>
                <option value="BLUNT">Blunt / Abrupt</option>
              </select>
            </div>

            <div>
              <label className="block text-[var(--text-muted)] uppercase mb-1">Verbosity</label>
              <select
                value={verbosity}
                onChange={(e) => setVerbosity(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
              >
                <option value="CONCISE">Concise / Terse</option>
                <option value="MODERATE">Moderate</option>
                <option value="LONG_WINDED">Detailed / Rambling</option>
              </select>
            </div>

            <div>
              <label className="block text-[var(--text-muted)] uppercase mb-1">Initial Temperament</label>
              <select
                value={temperament}
                onChange={(e) => setTemperament(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
              >
                <option value="CALM">Calm</option>
                <option value="ANNOYED">Annoyed</option>
                <option value="PANICKED">Panicked</option>
                <option value="FURIOUS">Furious</option>
                <option value="CONFUSED">Confused</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/library?tab=personas')}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--surface-ticket)] text-[var(--text-muted)] border border-[var(--border-subtle)] mono-font cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white shadow-xs transition-colors mono-font cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isLoading ? 'Saving Persona...' : 'Save AI Persona Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePersonaPage;
