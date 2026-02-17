import { useApp } from '../context/AppContext';

function SettingsGearIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
      <path
        d="M10.63 2.29a1 1 0 0 1 2.74 0l.35 1.64a8.6 8.6 0 0 1 1.89.8l1.5-.74a1 1 0 0 1 1.83 1.05l-.62 1.59c.56.53 1.04 1.12 1.42 1.78l1.69.2a1 1 0 0 1 .69 1.66l-1.08 1.32c.04.3.06.61.06.92s-.02.62-.06.92l1.08 1.32a1 1 0 0 1-.69 1.66l-1.69.2a8.4 8.4 0 0 1-1.42 1.78l.62 1.59a1 1 0 0 1-1.83 1.05l-1.5-.74c-.59.34-1.22.61-1.89.8l-.35 1.64a1 1 0 0 1-2.74 0l-.35-1.64a8.6 8.6 0 0 1-1.89-.8l-1.5.74a1 1 0 0 1-1.83-1.05l.62-1.59a8.4 8.4 0 0 1-1.42-1.78l-1.69-.2a1 1 0 0 1-.69-1.66l1.08-1.32A7.6 7.6 0 0 1 3.2 12c0-.31.02-.62.06-.92L2.18 9.76a1 1 0 0 1 .69-1.66l1.69-.2c.38-.66.86-1.25 1.42-1.78l-.62-1.59a1 1 0 0 1 1.83-1.05l1.5.74c.59-.34 1.22-.61 1.89-.8l.35-1.64Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function MusicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M14 4v10.2a2.8 2.8 0 1 1-1.2-2.3V7.6L8 8.8v6.4a2.8 2.8 0 1 1-1.2-2.3V7.9c0-.54.36-1.01.88-1.15L13.48 5a.42.42 0 0 1 .52.4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M20 11a8 8 0 1 1-2.34-5.66M20 4v5h-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SettingsContent() {
  const { isMusicPlaying, toggleMusic, resetExperience, isAnniversaryUnlocked } = useApp();
  const currentYear = new Date().getFullYear();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 py-12"
    >
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-rose-gold/35 bg-charcoal-light/85 p-7 shadow-[0_28px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 14% -8%, rgba(212,165,172,0.18) 0%, rgba(20,20,24,0) 42%), radial-gradient(circle at 100% 112%, rgba(153,102,204,0.14) 0%, rgba(20,20,24,0) 45%)',
          }}
        />

        <div className="relative text-center mb-7">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-gold/40 bg-charcoal-lighter/75 text-rose-gold-light shadow-[0_10px_25px_rgba(0,0,0,0.35)]">
            <SettingsGearIcon />
          </div>
          <p className="text-[11px] uppercase tracking-[0.34em] text-amethyst-light/55">Module</p>
          <h2 className="mt-1 text-3xl font-semibold text-rose-gold-light">Settings</h2>
          <p className="mt-2 text-sm text-rose-gold-light/60">Personalize your experience with subtle controls.</p>
        </div>

        <div className="relative space-y-3">
          <button
            onClick={toggleMusic}
            type="button"
            role="switch"
            aria-checked={isMusicPlaying}
            className="group w-full rounded-2xl border border-rose-gold/22 bg-charcoal-lighter/55 px-4 py-4 transition-all hover:-translate-y-px hover:border-rose-gold/35 hover:bg-charcoal-lighter/75 sm:px-5"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-gold/25 bg-charcoal/65 text-rose-gold-light/85">
                  <MusicIcon />
                </div>
                <div className="min-w-0 text-left">
                  <p className="truncate text-base text-rose-gold-light">Background Music</p>
                  <p className="truncate text-xs text-amethyst-light/55">
                    {isMusicPlaying ? 'Now playing ambient soundtrack' : 'Muted for a quieter experience'}
                  </p>
                </div>
              </div>

              <span
                className={`relative inline-flex h-7 w-14 shrink-0 rounded-full border transition-all ${
                  isMusicPlaying
                    ? 'border-rose-gold/70 bg-rose-gold/75'
                    : 'border-rose-gold/25 bg-charcoal/80'
                }`}
                aria-hidden="true"
              >
                <span
                  className="absolute top-0.5 h-5.5 w-5.5 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
                  style={{
                    left: isMusicPlaying ? '1.85rem' : '0.2rem',
                    transition: 'left 220ms ease',
                  }}
                />
              </span>
            </div>
          </button>

          <div className="w-full rounded-2xl border border-rose-gold/22 bg-charcoal-lighter/45 px-4 py-4 sm:px-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-base text-rose-gold-light/90">Anniversary Access</p>
                <p className="text-xs text-amethyst-light/55">Special content availability status</p>
              </div>
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
                  isAnniversaryUnlocked
                    ? 'border-emerald-400/35 bg-emerald-500/10 text-emerald-300'
                    : 'border-amethyst-light/25 bg-amethyst/10 text-amethyst-light/75'
                }`}
              >
                {isAnniversaryUnlocked ? 'Unlocked' : 'Locked'}
              </span>
            </div>
          </div>

          <button
            onClick={resetExperience}
            type="button"
            className="group w-full rounded-2xl border border-crimson/35 bg-crimson/8 px-4 py-4 text-left transition-all hover:-translate-y-px hover:bg-crimson/12 sm:px-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-crimson/35 bg-charcoal/75 text-crimson">
                <ResetIcon />
              </div>
              <div>
                <p className="text-base text-crimson">Reset Experience</p>
                <p className="text-xs text-rose-gold-light/55">Restart progression and return to initial state</p>
              </div>
            </div>
          </button>
        </div>

        <div className="relative mt-7 border-t border-rose-gold/16 pt-5 text-center">
          <p className="text-sm text-rose-gold-light/45">Made with care for my Valentine</p>
          <p className="mt-1 text-xs tracking-wide text-amethyst-light/35">Kurt Juanitez | {currentYear}</p>
        </div>
      </div>
    </div>
  );
}
