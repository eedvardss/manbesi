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

// Generates a fully organic, scattered array of text that mathematically guarantees no overlapping
const ScatterLayer = ({ speed }) => {
  const bgItems = useMemo(() => {
    const phrases = [];
    const maxAttempts = 2000;
    let placed = 0;
    const targetCount = 35;

    // Checks if two bounding boxes overlap
    const checkOverlap = (r1, r2) => {
       const padY = 3; // Vertical padding margin (vh)
       const padX = 2; // Horizontal padding margin (vw)
       return (
         r1.left < r2.right + padX &&
         r1.right > r2.left - padX &&
         r1.top < r2.bottom + padY &&
         r1.bottom > r2.top - padY
       );
    };

    for(let i=0; i < maxAttempts && placed < targetCount; i++) {
       const text = PHRASES[Math.floor(Math.random() * PHRASES.length)];
       
       // 3 Tiers of depth. Reduced blur drastically based on feedback.
       const tier = Math.floor(Math.random() * 3);
       const scale = tier === 0 ? 0.8 : tier === 1 ? 1 : 1.2;
       const opacity = tier === 0 ? 0.06 : tier === 1 ? 0.12 : 0.20;
       const blur = tier === 0 ? '0.5px' : '0px'; 
       
       // Random positioning
       const top = Math.random() * 200; // 0 to 200vh for a tall looping canvas
       const left = Math.random() * 70; // 0 to 70vw to avoid clipping on the right edge
       
       // Approximate bounding box calculations
       const width = text.length * 1.1 * scale; // Approx char width to vw
       const height = 5 * scale; // Approx line height to vh
       
       const rect1 = { top, bottom: top + height, left, right: left + width };
       
       let overlaps = false;
       for(const p of phrases) {
          const r2 = p.rect;
          // Check standard overlap, plus loop wrap-around overlaps
          const r2_up = { ...r2, top: r2.top - 200, bottom: r2.bottom - 200 };
          const r2_down = { ...r2, top: r2.top + 200, bottom: r2.bottom + 200 };
          
          if (checkOverlap(rect1, r2) || checkOverlap(rect1, r2_up) || checkOverlap(rect1, r2_down)) {
             overlaps = true;
             break;
          }
       }
       
       if (!overlaps) {
          phrases.push({
             id: placed, text, top: `${top}vh`, left: `${left}vw`,
             scale, opacity, blur, rect: rect1
          });
          placed++;
       }
    }
    return phrases;
  }, []);

  return (
    <div className="absolute inset-0 w-full h-[200vh] falling-scatter pointer-events-none" style={{ animationDuration: speed }}>
       {/* Original Block */}
       <div className="absolute top-0 left-0 w-full h-full">
          {bgItems.map(item => (
             <div key={`orig-${item.id}`} className="absolute whitespace-nowrap font-black uppercase tracking-tighter" style={{ top: item.top, left: item.left, opacity: item.opacity, filter: `blur(${item.blur})`, transform: `scale(${item.scale})`, transformOrigin: 'left top' }}>
                {item.text}
             </div>
          ))}
       </div>
       {/* Seamless Loop Duplicate Block */}
       <div className="absolute left-0 w-full h-full" style={{ top: '-200vh' }}>
          {bgItems.map(item => (
             <div key={`dup-${item.id}`} className="absolute whitespace-nowrap font-black uppercase tracking-tighter" style={{ top: item.top, left: item.left, opacity: item.opacity, filter: `blur(${item.blur})`, transform: `scale(${item.scale})`, transformOrigin: 'left top' }}>
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !problem) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail('');
      setProblem('');
    }, 1500);
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap');

          @keyframes scatterFall {
            0% { transform: translateY(0); }
            100% { transform: translateY(200vh); }
          }
          .falling-scatter {
            animation: scatterFall linear infinite;
            will-change: transform;
          }
          textarea::-webkit-scrollbar { display: none; }
          textarea { -ms-overflow-style: none; scrollbar-width: none; }
          
          input:-webkit-autofill,
          input:-webkit-autofill:hover, 
          input:-webkit-autofill:focus, 
          textarea:-webkit-autofill,
          textarea:-webkit-autofill:hover,
          textarea:-webkit-autofill:focus {
            -webkit-box-shadow: 0 0 0 30px #A31D36 inset !important;
            -webkit-text-fill-color: #FFF5F5 !important;
            transition: background-color 5000s ease-in-out 0s;
          }
        `}
      </style>

      {/* Main Container */}
      <div 
        className="min-h-screen bg-gradient-to-br from-[#A31D36] via-[#821327] to-[#4A0713] text-[#FFF5F5] selection:bg-[#FFF5F5] selection:text-[#821327] relative overflow-hidden flex items-center justify-center p-4"
        style={{ fontFamily: "'Manrope', sans-serif" }}
      >
        
        {/* Subtle Dot Pattern Overlay */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-100" 
          style={{ 
            backgroundImage: 'radial-gradient(rgba(255, 245, 245, 0.15) 1.5px, transparent 1.5px)', 
            backgroundSize: '32px 32px' 
          }} 
        />

        {/* Grain Noise Overlay */}
        <svg className="pointer-events-none fixed inset-0 z-50 w-full h-full opacity-[0.20] mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.3 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>

        {/* ORGANIC SCATTERED BACKGROUND */}
        <div className="absolute inset-0 z-0 pointer-events-none w-full h-full overflow-hidden">
           <ScatterLayer speed="55s" />
        </div>

        {/* Dark Vignette - Smoothed out to remove the light ring */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.4)_0%,_rgba(0,0,0,0.85)_100%)] pointer-events-none" />

        {/* CENTERED CONTENT */}
        <div className="w-full max-w-xl relative z-10 flex flex-col items-center text-center">
          
          <div className="mb-10 lg:mb-14">
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase opacity-70 mb-5">
              manbesi.lv
            </h2>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter leading-[1.1] mb-5 drop-shadow-md">
              JA TEV BESĪ KAUT KO DARĪT MANUĀLI, <br className="hidden sm:block"/>
              <span className="opacity-60 text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5F5] to-[#FFF5F5]/40">
                VARAM PALĪDZĒT.
              </span>
            </h1>
            <p className="text-sm lg:text-base font-light opacity-80 max-w-md mx-auto leading-relaxed">
              Mēs pārvēršam stundām ilgu, garlaicīgu darbu sekundēs. 
            </p>
          </div>

          <div className="w-full">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-md mx-auto">
                
                <div className="group relative w-full text-left">
                  <label htmlFor="email" className="block text-[10px] font-bold tracking-[0.15em] uppercase opacity-50 mb-2 pl-1">
                    Tavs e-pasts
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-[#FFF5F5]/30 pb-2 text-base lg:text-lg font-light focus:outline-none focus:border-[#FFF5F5] transition-all duration-300 placeholder:text-[#FFF5F5]/20"
                    placeholder="vards@uznemums.lv"
                  />
                </div>

                <div className="group relative w-full text-left">
                  <label htmlFor="problem" className="block text-[10px] font-bold tracking-[0.15em] uppercase opacity-50 mb-2 pl-1">
                    Kas tieši tev besī?
                  </label>
                  <textarea
                    id="problem"
                    required
                    rows={3}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="w-full bg-transparent border-b border-[#FFF5F5]/30 pb-2 text-base lg:text-lg font-light focus:outline-none focus:border-[#FFF5F5] transition-all duration-300 resize-none placeholder:text-[#FFF5F5]/20 leading-relaxed"
                    placeholder="Apraksti savu ikdienas manuālo procesu..."
                  />
                </div>

                <div className="pt-4 w-full flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    type="button"
                    className="group relative overflow-hidden bg-transparent border border-[#FFF5F5]/30 text-[#FFF5F5] py-4 px-8 rounded-full flex items-center justify-center gap-3 transition-all duration-300 hover:bg-[#FFF5F5]/10 hover:border-[#FFF5F5]/60 hover:scale-[1.03]"
                  >
                    <span className="text-xs lg:text-sm font-bold uppercase tracking-[0.15em]">
                      Mūsu darbi
                    </span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative overflow-hidden bg-[#FFF5F5] text-[#821327] py-4 px-8 rounded-full flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(255,245,245,0.2)] disabled:opacity-70 disabled:cursor-wait disabled:hover:scale-100"
                  >
                    <span className="text-xs lg:text-sm font-bold uppercase tracking-[0.15em]">
                      {isSubmitting ? 'Tiek apstrādāts...' : 'Gribu automatizēt'}
                    </span>
                    {!isSubmitting && (
                      <span className="text-lg transform transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="animate-in fade-in zoom-in duration-700 py-6 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-[#FFF5F5]/30 flex items-center justify-center mb-5">
                  <span className="text-xl">✓</span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-black tracking-tighter mb-3">
                  ZIŅA SAŅEMTA.
                </h3>
                <p className="text-sm lg:text-base font-light opacity-80 mb-6 max-w-sm text-center">
                  Mēs izpētīsim tavas problēmas automatizācijas iespējas un drīzumā dosim ziņu uz:
                  <br/><strong className="mt-2 block font-medium text-[#FFF5F5]">{email}</strong>
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-[10px] lg:text-xs font-bold tracking-[0.15em] uppercase opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2 border-b border-transparent hover:border-[#FFF5F5] pb-1"
                >
                  <span>←</span> Iesniegt citu procesu
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
}