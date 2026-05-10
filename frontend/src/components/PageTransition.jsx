import { useEffect, useState } from 'react';

const MESSAGES = [
  'Initializing research agent...',
  'Connecting to ArXiv...',
  'Ready to analyze...',
];

export default function PageTransition({ onComplete }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const messageTimers = [
      setTimeout(() => setMessageIndex(1), 1150),
      setTimeout(() => setMessageIndex(2), 2300),
    ];
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 3500);

    return () => {
      messageTimers.forEach((timer) => clearTimeout(timer));
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#0d1117]">
      <div className="hero-bg absolute inset-0 opacity-50" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 rounded-full border border-[#c9a84c]/30" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#c9a84c] animate-[spin_1s_linear_infinite]" />
          </div>

          <h1 className="mt-8 font-display text-4xl font-semibold text-white opacity-0 animate-[fadeIn_500ms_ease-out_500ms_forwards]">
            ThesisLens
          </h1>

          <p
            key={messageIndex}
            className="mt-5 text-sm text-[#c9a84c] opacity-0 animate-[messageFade_1000ms_ease-in-out_forwards]"
          >
            {MESSAGES[messageIndex]}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes messageFade {
          0% { opacity: 0; transform: translateY(4px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
