import React, { useState, useMemo } from 'react';

const PHRASES = [
  "Man besī lasīt 100 ēpastus katru dienu",
  "Man besī šķirot failus",
  "Kaut šo varētu izdarīt automātiski",
  "Noguru no Copy-Paste",
  "Atkal tas pats jāvada sistēmā",
  "Excel man rādās murgos",
  "Kāpēc tas viss jādara ar rokām?",
  "Man nav laika šim bezjēdzīgajam darbam",
  "Dati nesakrīt, atkal jāpārbauda",
  "Vēl viena garlaicīga atskaite",
  "Sistēmas savā starpā nesazinās",
  "Man besī manuāla datu ievade"
];

const ScatterLayer = ({ speed }) => {
  const bgItems = useMemo(() => {
    const phrases = [];
    const maxAttempts = 2000;
    let placed = 0;
    const targetCount = 30;

    const checkOverlap = (r1, r2) => {
      const padY = 3, padX = 2;
      return (
        r1.left < r2.right + padX &&
        r1.right > r2.left - padX &&
        r1.top < r2.bottom + padY &&
        r1.bottom > r2.top - padY
      );
    };

    for (let i = 0; i < maxAttempts && placed < targetCount; i++) {
      const text = PHRASES[Math.floor(Math.random() * PHRASES.length)];
      const tier = Math.floor(Math.random() * 3);
      const scale = tier === 0 ? 0.75 : tier === 1 ? 1 : 1.2;
      const opacity = tier === 0 ? 0.04 : tier === 1 ? 0.09 : 0.15;
      const blur = tier === 0 ? '0.5px' : '0px';
      const top = Math.random() * 200;
      const left = Math.random() * 65;
      const width = text.length * 1.1 * scale;
      const height = 5 * scale;
      const rect1 = { top, bottom: top + height, left, right: left + width };

      let overlaps = false;
      for (const p of phrases) {
        const r2 = p.rect;
        const r2_up = { ...r2, top: r2.top - 200, bottom: r2.bottom - 200 };
        const r2_down = { ...r2, top: r2.top + 200, bottom: r2.bottom + 200 };
        if (checkOverlap(rect1, r2) || checkOverlap(rect1, r2_up) || checkOverlap(rect1, r2_down)) {
          overlaps = true;
          break;
        }
      }

      if (!overlaps) {
        phrases.push({ id: placed, text, top: `${top}vh`, left: `${left}vw`, scale, opacity, blur, rect: rect1 });
        placed++;
      }
    }
    return phrases;
  }, []);

  return (
    <div className="absolute inset-0 w-full h-[200vh] falling-scatter pointer-events-none" style={{ animationDuration: speed }}>
      <div className="absolute top-0 left-0 w-full h-full">
        {bgItems.map(item => (
          <div key={`orig-${item.id}`} className="absolute whitespace-nowrap font-black uppercase tracking-tighter" style={{ top: item.top, left: item.left, opacity: item.opacity, filter: `blur(${item.blur})`, transform: `scale(${item.scale})`, transformOrigin: 'left top', color: '#c9f23e' }}>
            {item.text}
          </div>
        ))}
      </div>
      <div className="absolute left-0 w-full h-full" style={{ top: '-200vh' }}>
        {bgItems.map(item => (
          <div key={`dup-${item.id}`} className="absolute whitespace-nowrap font-black uppercase tracking-tighter" style={{ top: item.top, left: item.left, opacity: item.opacity, filter: `blur(${item.blur})`, transform: `scale(${item.scale})`, transformOrigin: 'left top', color: '#c9f23e' }}>
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AppV2() {
  const [email, setEmail] = useState('');
  const [problem, setProblem] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !problem) return;
    setIsSubmitting(true);
    setSubmittedEmail(email);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail('');
      setProblem('');
    }, 1500);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@200;300;400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        @keyframes scatterFall {
          0%   { transform: translateY(0); }
          100% { transform: translateY(200vh); }
        }
        .falling-scatter {
          animation: scatterFall linear infinite;
          will-change: transform;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fu1 { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
        .fu2 { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s  both; }
        .fu3 { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.35s both; }
        .fu4 { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.45s both; }
        .fu5 { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.55s both; }
        .fu6 { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.65s both; }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }
        .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }

        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .blink { animation: blinkCursor 1s step-end infinite; }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .slide-right { animation: slideInRight 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s both; }

        textarea::-webkit-scrollbar { display: none; }
        textarea { -ms-overflow-style: none; scrollbar-width: none; }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 30px #0c0c14 inset !important;
          -webkit-text-fill-color: #e6e3dc !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        .v2-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid #252530;
          color: #e6e3dc;
          font-family: 'Manrope', sans-serif;
          font-size: 0.92rem;
          font-weight: 300;
          padding: 0 0 0.8rem;
          outline: none;
          transition: border-color 0.3s ease;
          caret-color: #c9f23e;
          resize: none;
        }
        .v2-input::placeholder { color: #2a2a36; }
        .v2-input:focus { border-bottom-color: #c9f23e; }

        .v2-submit {
          width: 100%;
          background: #c9f23e;
          color: #07070a;
          border: none;
          font-family: 'Manrope', sans-serif;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          padding: 1.1rem 2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
        }
        .v2-submit:hover:not(:disabled) {
          background: #d4ff4a;
          box-shadow: 0 0 52px rgba(201,242,62,0.25);
          transform: translateY(-1px);
        }
        .v2-submit:disabled { opacity: 0.5; cursor: wait; }
        .v2-submit .arr { transition: transform 0.2s; }
        .v2-submit:hover:not(:disabled) .arr { transform: translateX(4px); }

        /* Divider line with accent gradient */
        .panel-divider {
          width: 1px;
          background: linear-gradient(to bottom, transparent 0%, #c9f23e22 20%, #c9f23e44 50%, #c9f23e22 80%, transparent 100%);
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .split-layout { flex-direction: column !important; }
          .right-panel { width: 100% !important; min-height: 60vh; border-left: none !important; border-top: 1px solid #1c1c22 !important; }
          .panel-divider { display: none; }
          .left-panel { min-height: 50vh; }
        }
      `}</style>

      <div
        className="split-layout min-h-screen flex"
        style={{ background: '#07070a', color: '#e6e3dc', fontFamily: "'Manrope', sans-serif" }}
      >

        {/* ═══════════ LEFT PANEL ═══════════ */}
        <div
          className="left-panel relative flex-1 flex flex-col justify-between overflow-hidden"
          style={{ padding: 'clamp(2rem, 5vw, 4rem)' }}
        >
          {/* Dot grid */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: 'radial-gradient(rgba(201,242,62,0.06) 1px, transparent 1px)',
              backgroundSize: '34px 34px',
            }}
          />

          {/* Grain */}
          <svg className="pointer-events-none fixed inset-0 z-50 w-full h-full opacity-[0.12] mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
            <filter id="noise2">
              <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.35 0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise2)" />
          </svg>

          {/* Top glow */}
          <div
            className="absolute top-0 left-0 pointer-events-none z-0"
            style={{
              width: '100%',
              height: '40%',
              background: 'radial-gradient(ellipse at top left, rgba(201,242,62,0.07) 0%, transparent 70%)',
            }}
          />

          {/* Scatter layer */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <ScatterLayer speed="80s" />
          </div>

          {/* Vignette */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 30% 50%, transparent 20%, rgba(7,7,10,0.75) 100%)' }}
          />

          {/* ── Left content ── */}
          <div className="relative z-10">
            {/* Top row */}
            <div className="fu1 flex items-center justify-between flex-wrap gap-4">
              <span style={{ fontSize: '0.6rem', letterSpacing: '0.28em', color: '#2e2e38', textTransform: 'uppercase', fontWeight: 700 }}>
                manbesi.lv
              </span>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ border: '1px solid #1c1c22' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-[#c9f23e] pulse-dot" />
                <span style={{ fontSize: '0.58rem', letterSpacing: '0.2em', color: '#484844', textTransform: 'uppercase', fontWeight: 600 }}>
                  Pieņemam pieteikumus
                </span>
              </div>
            </div>
          </div>

          {/* ── Center: Title ── */}
          <div className="relative z-10 flex-1 flex flex-col justify-center py-8">
            <div className="fu2">
              <h1
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(3.8rem, 9vw, 8rem)',
                  lineHeight: 0.87,
                  letterSpacing: '-0.04em',
                  textTransform: 'uppercase',
                  color: '#e6e3dc',
                }}
              >
                MAN
                <br />
                BES<span style={{ color: '#c9f23e' }}>Ī</span>
                <span className="blink" style={{ color: '#c9f23e', fontSize: '0.7em' }}>_</span>
              </h1>
            </div>

            <div className="fu3 mt-6" style={{ maxWidth: '380px' }}>
              <div style={{ width: '32px', height: '1px', background: '#c9f23e', marginBottom: '1.2rem', opacity: 0.6 }} />
              <p style={{ fontSize: '0.82rem', fontWeight: 300, lineHeight: 1.8, color: '#4a4a48' }}>
                Jebko, ko dari manuāli katru dienu —<br />
                mēs to automatizēsim. Nav svarīgi cik<br />
                sarežģīti. Uzraksti. Mēs parūpēsimies.
              </p>
            </div>

            {/* Capabilities */}
            <div className="fu4 flex flex-wrap gap-3 mt-8">
              {['Automatizācija', 'Integrācija', 'Atrisinājumi'].map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: '0.6rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    color: '#2e2e38',
                    padding: '0.4rem 0.9rem',
                    border: '1px solid #1a1a22',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="fu5 relative z-10">
            <span style={{ fontSize: '0.58rem', letterSpacing: '0.15em', color: '#1e1e26', textTransform: 'uppercase' }}>
              © 2025 manbesi.lv
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="panel-divider" />

        {/* ═══════════ RIGHT PANEL ═══════════ */}
        <div
          className="right-panel relative flex flex-col justify-center slide-right"
          style={{
            width: '420px',
            flexShrink: 0,
            background: '#0c0c14',
            padding: 'clamp(2rem, 5vw, 4rem)',
          }}
        >
          {/* Subtle top accent line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, transparent, #c9f23e40, transparent)' }} />

          {!isSubmitted ? (
            <>
              {/* Form header */}
              <div className="mb-10">
                <p style={{ fontSize: '0.58rem', letterSpacing: '0.25em', color: '#2e2e3a', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.75rem' }}>
                  Sāc šeit
                </p>
                <h2
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: '1.5rem',
                    letterSpacing: '-0.03em',
                    color: '#e6e3dc',
                    lineHeight: 1.15,
                  }}
                >
                  Pastāsti par<br />
                  <span style={{ color: '#c9f23e' }}>savu problēmu.</span>
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div>
                  <label htmlFor="v2-email" style={{ display: 'block', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#333340', marginBottom: '0.65rem' }}>
                    E-pasts
                  </label>
                  <input
                    type="email"
                    id="v2-email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="v2-input"
                    placeholder="vards@uznemums.lv"
                  />
                </div>

                <div>
                  <label htmlFor="v2-problem" style={{ display: 'block', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#333340', marginBottom: '0.65rem' }}>
                    Kas tev besī?
                  </label>
                  <textarea
                    id="v2-problem"
                    required
                    rows={4}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="v2-input"
                    placeholder="Apraksti savu ikdienas manuālo procesu..."
                  />
                </div>

                <div>
                  <button type="submit" disabled={isSubmitting} className="v2-submit">
                    {isSubmitting ? 'Apstrādā...' : (
                      <><span>Nosūtīt</span><span className="arr">→</span></>
                    )}
                  </button>
                </div>
              </form>

              {/* Bottom note */}
              <p style={{ marginTop: '2rem', fontSize: '0.6rem', color: '#252530', lineHeight: 1.6, fontWeight: 300 }}>
                Mēs atbildam 24h laikā. Nav saistošu līgumu.
              </p>
            </>
          ) : (
            <div className="flex flex-col items-start">
              <div style={{ width: '44px', height: '44px', border: '1px solid rgba(201,242,62,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <span style={{ color: '#c9f23e', fontSize: '1.1rem' }}>✓</span>
              </div>
              <h3
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: '1.8rem',
                  letterSpacing: '-0.03em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                  color: '#e6e3dc',
                }}
              >
                Saņemts.
              </h3>
              <p style={{ fontSize: '0.8rem', fontWeight: 300, color: '#4a4a48', lineHeight: 1.75, marginBottom: '2rem' }}>
                Izskatīsim pieteikumu un sazināsimies ar{' '}
                <span style={{ color: '#e6e3dc', fontWeight: 500 }}>{submittedEmail}</span>
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                style={{
                  fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: '#333340',
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#c9f23e'}
                onMouseLeave={e => e.currentTarget.style.color = '#333340'}
              >
                ← Iesniegt vēl
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
