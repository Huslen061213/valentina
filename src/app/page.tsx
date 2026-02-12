"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface HeartParticle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  emoji: string;
}

const HEART_EMOJIS = ["❤️", "🩷", "💕", "💗", "💓", "🌸", "💖", "🌷"];
const NO_MESSAGES = [
  "Хүлээ, дахиж бод! 🥺",
  "Баавгай уйлна шүү! 😢",
  "Үнэхээр үгүй гэж үү? 💔",
  "Зүүн тийш! 👈",
  "Нааш ир! 🐻",
  "Тийш биш! ➡️",
  "Хаашаа явж байна? 😂",
  "Тэгэхгүй ч болно! 😤",
];

function BearSVG() {
  return (
    <svg
      viewBox="0 0 200 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: 140,
        height: 140,
        filter: "drop-shadow(0 8px 18px rgba(200,100,100,0.3))",
      }}
    >
      <circle cx="58" cy="68" r="18" fill="#C68642" />
      <circle cx="58" cy="68" r="11" fill="#E8A87C" />
      <circle cx="142" cy="68" r="18" fill="#C68642" />
      <circle cx="142" cy="68" r="11" fill="#E8A87C" />
      <circle cx="100" cy="90" r="45" fill="#D4956A" />
      <ellipse cx="100" cy="105" rx="18" ry="13" fill="#E8C49A" />
      <ellipse cx="100" cy="100" rx="7" ry="5" fill="#5a2d0c" />
      <circle cx="83" cy="85" r="6" fill="#2d1a0a" />
      <circle cx="117" cy="85" r="6" fill="#2d1a0a" />
      <circle cx="85" cy="83" r="2" fill="white" />
      <circle cx="119" cy="83" r="2" fill="white" />
      <path
        d="M89 112 Q100 122 111 112"
        stroke="#5a2d0c"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="100" cy="160" rx="50" ry="48" fill="#C68642" />
      <ellipse cx="100" cy="163" rx="30" ry="28" fill="#E8A87C" />
      <ellipse
        cx="58"
        cy="158"
        rx="14"
        ry="28"
        fill="#C68642"
        transform="rotate(-25 58 158)"
      />
      <ellipse
        cx="142"
        cy="158"
        rx="14"
        ry="28"
        fill="#C68642"
        transform="rotate(25 142 158)"
      />
      <rect x="60" y="128" width="5" height="22" rx="2" fill="#3a8a3a" />
      <rect
        x="67"
        y="122"
        width="5"
        height="18"
        rx="2"
        fill="#3a8a3a"
        transform="rotate(8 67 122)"
      />
      <circle cx="63" cy="126" r="11" fill="#e8506e" />
      <circle cx="74" cy="120" r="10" fill="#c82a52" />
      <circle cx="68" cy="114" r="9" fill="#f06888" />
      <circle cx="64" cy="120" r="5" fill="#f090a0" opacity="0.6" />
      <circle cx="73" cy="127" r="5" fill="#f090a0" opacity="0.6" />
      <ellipse
        cx="58"
        cy="138"
        rx="7"
        ry="4"
        fill="#2a7a2a"
        transform="rotate(-30 58 138)"
      />
    </svg>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 50 }, (_, i) => i);
  const colors = [
    "#ff4d6d",
    "#ff9a9e",
    "#ffd6e0",
    "#ff758c",
    "#c9184a",
    "#ffb3c1",
    "#ffc8dd",
  ];
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      {pieces.map((i) => {
        const x = Math.random() * 100;
        const delay = Math.random() * 0.8;
        const dur = 1.8 + Math.random() * 1.5;
        const size = 8 + Math.random() * 14;
        const color = colors[Math.floor(Math.random() * colors.length)];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: "-20px",
              width: size,
              height: size,
              background: color,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
              animation: `cfFall ${dur}s ${delay}s ease-in forwards`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function Valentine() {
  const [hearts, setHearts] = useState<HeartParticle[]>([]);
  const [noPos, setNoPos] = useState({ top: "60%", left: "58%" });
  const [noMsgIdx, setNoMsgIdx] = useState(-1);
  const [noMsgKey, setNoMsgKey] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [yesScale, setYesScale] = useState(1);
  const [noTransition, setNoTransition] = useState(false);
  const noClickCount = useRef(0);

  useEffect(() => {
    setHearts(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 10 + Math.random() * 22,
        duration: 6 + Math.random() * 8,
        delay: Math.random() * 8,
        emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
      })),
    );
    // Enable transition after first render so initial position doesn't animate
    const t = setTimeout(() => setNoTransition(true), 200);
    return () => clearTimeout(t);
  }, []);

  const escapeNo = useCallback(
    (e?: React.MouseEvent) => {
      if (answered) return;
      e?.preventDefault();
      noClickCount.current += 1;

      // Yes grows a little each time, capped smaller on mobile to avoid overflow
      const isMobile = window.innerWidth < 640;
      const maxScale = isMobile ? 1.85 : 2.5;
      setYesScale((prev) => Math.min(prev + 0.1, maxScale));

      // Show random teasing message
      setNoMsgIdx(Math.floor(Math.random() * NO_MESSAGES.length));
      setNoMsgKey((k) => k + 1);

      // Slide No button to a new random spot on screen
      const margin = 24;
      const btnW = isMobile ? 120 : 140;
      const btnH = isMobile ? 50 : 56;
      const newLeft =
        margin + Math.random() * (window.innerWidth - btnW - margin * 2);
      const newTop =
        margin + Math.random() * (window.innerHeight - btnH - margin * 2);
      setNoPos({ left: `${newLeft}px`, top: `${newTop}px` });
    },
    [answered],
  );

  const handleYes = () => {
    setAnswered(true);
    setShowConfetti(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800;900&family=Quicksand:wght@500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Quicksand', sans-serif; overflow: hidden; }

        .valentine-shell {
          min-height: 100vh;
          overflow: hidden;
          position: relative;
          background: linear-gradient(135deg,#ffe0ea 0%,#ffd6e7 45%,#ffeaf2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .valentine-card {
          position: relative;
          z-index: 10;
          background: rgba(255,255,255,0.62);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          border: 2px solid rgba(255,160,185,0.45);
          border-radius: 44px;
          padding: 48px 56px 44px;
          text-align: center;
          box-shadow: 0 24px 64px rgba(255,80,120,0.18),0 4px 24px rgba(255,140,165,0.14);
          max-width: 480px;
          width: min(90vw, 480px);
          animation: cardIn 0.8s cubic-bezier(0.34,1.56,0.64,1) both;
        }

        .bear-wrap {
          margin-bottom: 16px;
          animation: bearBounce 2.4s ease-in-out infinite;
        }

        .title {
          font-family: 'Baloo 2', cursive;
          font-weight: 900;
          font-size: clamp(1.7rem,5vw,2.2rem);
          color: #2d1218;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }

        .tease-wrap {
          height: 30px;
          margin-bottom: 20px;
        }

        .tease-msg {
          font-size: 0.93rem;
          font-weight: 700;
          color: #b03060;
          animation: msgIn 2.4s ease both;
        }

        .yes-row {
          display: flex;
          justify-content: center;
        }

        .yes-btn, .no-btn {
          font-family: 'Baloo 2', cursive;
          font-weight: 800;
          font-size: 1.25rem;
          border: none;
          border-radius: 50px;
          padding: 14px 44px;
          cursor: pointer;
          letter-spacing: 0.5px;
          min-width: 120px;
        }

        .yes-btn {
          background: linear-gradient(135deg,#4cca6e,#2ea84f);
          color: #fff;
          transition: transform 0.45s cubic-bezier(0.34,1.56,0.64,1);
          animation: yesPulse 2s ease-in-out infinite;
          transform-origin: center;
        }

        .success-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          animation: successPop 0.7s cubic-bezier(0.34,1.56,0.64,1) both;
        }

        .success-heart {
          font-size: 90px;
          animation: hbig 0.75s ease-in-out infinite alternate;
        }

        .success-title {
          font-family: 'Baloo 2', cursive;
          font-weight: 900;
          font-size: clamp(1.8rem,5vw,2.4rem);
          background: linear-gradient(90deg,#ff4d6d,#ff758c,#ff4d6d);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 2s linear infinite;
        }

        .success-copy {
          font-size: 1.12rem;
          font-weight: 600;
          color: #7a3348;
          line-height: 1.6;
        }

        .no-btn {
          background: linear-gradient(135deg,#ff6b6b,#e83b3b);
          color: #fff;
          box-shadow: 0 6px 22px rgba(230,60,60,0.42);
          position: fixed;
          z-index: 999;
        }

        .footer-pill {
          position: fixed;
          bottom: 16px;
          right: 20px;
          font-size: 0.82rem;
          color: rgba(150,70,90,0.75);
          font-weight: 700;
          background: rgba(255,255,255,0.55);
          padding: 6px 14px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,160,180,0.3);
          z-index: 20;
          font-family: 'Quicksand', sans-serif;
        }

        @keyframes floatUp {
          0%   { transform: translateY(100vh) rotate(0deg) scale(.5); opacity: 0; }
          10%  { opacity: .75; }
          90%  { opacity: .35; }
          100% { transform: translateY(-12vh) rotate(360deg) scale(1.3); opacity: 0; }
        }
        @keyframes bearBounce {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50%       { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: scale(.55) translateY(60px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes successPop {
          0%   { opacity: 0; transform: scale(.4) rotate(-8deg); }
          70%  { transform: scale(1.08) rotate(2deg); }
          100% { opacity: 1; transform: scale(1) rotate(0); }
        }
        @keyframes hbig {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.25); }
        }
        @keyframes msgIn {
          0%   { opacity: 0; transform: translateY(8px); }
          20%  { opacity: 1; transform: translateY(0); }
          80%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes cfFall {
          0%   { transform: translateY(0) rotate(0); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes yesPulse {
          0%, 100% { box-shadow: 0 6px 22px rgba(50,170,80,0.42); }
          50%       { box-shadow: 0 12px 38px rgba(50,210,80,0.65); }
        }

        @media (max-width: 768px) {
          .valentine-shell { padding: 14px; align-items: flex-start; }
          .valentine-card {
            width: 100%;
            max-width: 430px;
            margin-top: 24px;
            border-radius: 32px;
            padding: 30px 24px 28px;
          }
          .yes-btn, .no-btn { padding: 12px 30px; font-size: 1.1rem; }
          .success-heart { font-size: 76px; }
          .success-copy { font-size: 1rem; }
          .footer-pill { right: 12px; bottom: 12px; font-size: 0.76rem; }
        }

        @media (max-width: 420px) {
          .valentine-shell { padding: 10px; }
          .valentine-card {
            margin-top: 14px;
            border-radius: 26px;
            padding: 22px 16px 20px;
          }
          .title { font-size: 1.5rem; }
          .tease-wrap { height: 24px; margin-bottom: 14px; }
          .tease-msg { font-size: 0.82rem; }
          .yes-btn, .no-btn { padding: 11px 22px; font-size: 1rem; min-width: 110px; }
          .success-heart { font-size: 68px; }
          .success-copy { font-size: 0.94rem; line-height: 1.5; }
          .footer-pill { padding: 5px 10px; border-radius: 16px; }
        }
      `}</style>

      <div className="valentine-shell">
        {/* Floating hearts background */}
        {hearts.map((h) => (
          <div
            key={h.id}
            style={{
              position: "fixed",
              left: `${h.x}%`,
              bottom: 0,
              fontSize: h.size,
              opacity: 0,
              pointerEvents: "none",
              zIndex: 0,
              userSelect: "none",
              animation: `floatUp ${h.duration}s ${h.delay}s linear infinite`,
            }}
          >
            {h.emoji}
          </div>
        ))}

        {showConfetti && <Confetti />}

        {/* Card */}
        <div className="valentine-card">
          {!answered ? (
            <>
              <div className="bear-wrap">
                <BearSVG />
              </div>

              <h1 className="title">
                Will you be my Valentine? 💌
              </h1>

              {/* Teasing message */}
              <div className="tease-wrap">
                {noMsgIdx >= 0 && (
                  <p key={noMsgKey} className="tease-msg">
                    {NO_MESSAGES[noMsgIdx]}
                  </p>
                )}
              </div>

              {/* YES button only — grows with each No click */}
              <div className="yes-row">
                <button
                  onClick={handleYes}
                  className="yes-btn"
                  style={{
                    transform: `scale(${yesScale})`,
                  }}
                >
                  Yes 💚
                </button>
              </div>
            </>
          ) : (
            /* Success */
            <div className="success-wrap">
              <div className="success-heart">❤️</div>
              <h1 className="success-title">
                Yay! 🎉
              </h1>
              <p className="success-copy">
                Чи миний Valentine болно гэдгийг мэдэж байлаа! 🥰
                <br />
                Баавгай баярлаж байна 🐻💕
              </p>
            </div>
          )}
        </div>

        {/* NO button — fixed position, slides smoothly to a new random spot on every click */}
        {!answered && (
          <button
            onClick={escapeNo}
            className="no-btn"
            style={{
              top: noPos.top,
              left: noPos.left,
              transition: noTransition
                ? "top 0.45s cubic-bezier(0.34,1.56,0.64,1), left 0.45s cubic-bezier(0.34,1.56,0.64,1)"
                : "none",
            }}
          >
            No 💔
          </button>
        )}

        {/* Footer */}
        <div className="footer-pill">
          Made with ❤️
        </div>
      </div>
    </>
  );
}
