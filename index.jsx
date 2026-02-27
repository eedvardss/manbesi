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
    const targetCount = 35;

    const checkOverlap = (r1, r2) => {
      const padY = 3;
      const padX = 2;
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
      const scale = tier === 0 ? 0.8 : tier === 1 ? 1 : 1.2;
      const opacity = tier === 0 ? 0.03 : tier === 1 ? 0.07 : 0.12;
      const blur = tier === 0 ? '0.5px' : '0px';
      const top = Math.random() * 200;
      const left = Math.random() * 70;
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
          <div key={`orig-${item.id}`} className="absolute whitespace-nowrap font-black uppercase tracking-tighter scatter-text" style={{ top: item.top, left: item.left, opacity: item.opacity, filter: `blur(${item.blur})`, transform: `scale(${item.scale})`, transformOrigin: 'left top' }}>
            {item.text}
          </div>
        ))}
      </div>
      <div className="absolute left-0 w-full h-full" style={{ top: '-200vh' }}>
        {bgItems.map(item => (
          <div key={`dup-${item.id}`} className="absolute whitespace-nowrap font-black uppercase tracking-tighter scatter-text" style={{ top: item.top, left: item.left, opacity: item.opacity, filter: `blur(${item.blur})`, transform: `scale(${item.scale})`, transformOrigin: 'left top' }}>
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
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
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fu1 { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
        .fu2 { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.20s both; }
        .fu3 { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.35s both; }
        .fu4 { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.50s both; }
        .fu5 { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.65s both; }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.25; }
        }
        .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }

        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .blink { animation: blinkCursor 1s step-end infinite; }

        .scatter-text { color: #c9f23e; }

        textarea::-webkit-scrollbar { display: none; }
        textarea { -ms-overflow-style: none; scrollbar-width: none; }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 30px #07070a inset !important;
          -webkit-text-fill-color: #e6e3dc !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        .input-field {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid #1c1c22;
          color: #e6e3dc;
          font-family: 'Manrope', sans-serif;
          font-size: 0.95rem;
          font-weight: 300;
          padding: 0 0 0.75rem;
          outline: none;
          transition: border-color 0.3s ease;
          caret-color: #c9f23e;
          resize: none;
        }
        .input-field::placeholder { color: #2c2c34; }
        .input-field:focus { border-bottom-color: #c9f23e; }

        .submit-btn {
          width: 100%;
          background: #c9f23e;
          color: #07070a;
          border: none;
          font-family: 'Manrope', sans-serif;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 1.1rem 2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
        }
        .submit-btn:hover:not(:disabled) {
          background: #d4ff4a;
          box-shadow: 0 0 48px rgba(201,242,62,0.22);
          transform: translateY(-1px);
        }
        .submit-btn:disabled { opacity: 0.55; cursor: wait; }
        .submit-btn .arrow { transition: transform 0.2s ease; }
        .submit-btn:hover:not(:disabled) .arrow { transform: translateX(4px); }
      `}</style>

      <div
        className="min-h-screen relative overflow-hidden flex items-center justify-center p-6 lg:p-10"
        style={{
          background: '#07070a',
          color: '#e6e3dc',
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(201,242,62,0.065) 1px, transparent 1px)',
            backgroundSize: '34px 34px',
          }}
        />

        {/* Grain noise */}
        <svg className="pointer-events-none fixed inset-0 z-50 w-full h-full opacity-[0.13] mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.35 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>

        {/* Top accent glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-0"
          style={{
            width: '70vw',
            height: '35vh',
            background: 'radial-gradient(ellipse at top, rgba(201,242,62,0.055) 0%, transparent 70%)',
          }}
        />

        {/* Falling phrases */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <ScatterLayer speed="75s" />
        </div>

        {/* Vignette */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 25%, rgba(7,7,10,0.82) 100%)' }}
        />

        {/* ─── CONTENT ─── */}
        <div className="relative z-10 w-full max-w-[480px] flex flex-col items-center text-center">

          {/* Status pill */}
          <div className="fu1 flex items-center gap-2 mb-9 px-3.5 py-1.5 rounded-full" style={{ border: '1px solid #1c1c22' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#c9f23e] pulse-dot" />
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.22em', color: '#555550', textTransform: 'uppercase', fontWeight: 600 }}>
              Pieņemam pieteikumus
            </span>
          </div>

          {/* Title */}
          <div className="fu2 mb-5 w-full">
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.28em', color: '#333330', textTransform: 'uppercase', fontWeight: 700, marginBottom: '1.1rem' }}>
              manbesi.lv
            </div>
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(3.4rem, 13vw, 6.2rem)',
                lineHeight: 0.88,
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                color: '#e6e3dc',
              }}
            >
              MAN
              <br />
              BES<span style={{ color: '#c9f23e' }}>Ī</span>
              <span className="blink" style={{ color: '#c9f23e', fontSize: '0.75em' }}>_</span>
            </h1>
          </div>

          {/* Tagline */}
          <p className="fu3 mb-9" style={{ fontSize: '0.82rem', fontWeight: 300, lineHeight: 1.75, color: '#5a5a55', maxWidth: '360px' }}>
            Visu, ko atkārto katru dienu manuāli —<br />
            mēs automatizēsim. Uzraksti mums.
          </p>

          {/* Divider */}
          <div className="fu3 w-full mb-8" style={{ height: '1px', background: '#111116' }} />

          {/* Form / Success */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="fu4 w-full flex flex-col gap-7">

              <div className="text-left">
                <label htmlFor="email" style={{ display: 'block', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#333330', marginBottom: '0.6rem' }}>
                  E-pasts
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="vards@uznemums.lv"
                />
              </div>

              <div className="text-left">
                <label htmlFor="problem" style={{ display: 'block', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#333330', marginBottom: '0.6rem' }}>
                  Kas tev besī?
                </label>
                <textarea
                  id="problem"
                  required
                  rows={3}
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="input-field"
                  placeholder="Apraksti savu ikdienas manuālo procesu..."
                />
              </div>

              <div className="pt-1">
                <button type="submit" disabled={isSubmitting} className="submit-btn">
                  {isSubmitting ? 'Apstrādā...' : (
                    <><span>Nosūtīt</span><span className="arrow">→</span></>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="fu1 w-full py-6 flex flex-col items-center">
              <div style={{ width: '44px', height: '44px', border: '1px solid rgba(201,242,62,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.4rem' }}>
                <span style={{ color: '#c9f23e', fontSize: '1.1rem', fontWeight: 300 }}>✓</span>
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.6rem', letterSpacing: '-0.03em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Saņemts.
              </h3>
              <p style={{ fontSize: '0.8rem', fontWeight: 300, color: '#555550', lineHeight: 1.7, maxWidth: '300px', textAlign: 'center', marginBottom: '1.75rem' }}>
                Izskatīsim pieteikumu un sazināsimies ar{' '}
                <span style={{ color: '#e6e3dc', fontWeight: 500 }}>{submittedEmail}</span>
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#333330', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.color = '#c9f23e'}
                onMouseLeave={e => e.currentTarget.style.color = '#333330'}
              >
                ← Iesniegt vēl
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="fu5 mt-12" style={{ fontSize: '0.58rem', letterSpacing: '0.18em', color: '#1e1e24', textTransform: 'uppercase' }}>
            manbesi.lv — mēs parūpēsimies
          </div>

        </div>
      </div>
    </>
  );
}
