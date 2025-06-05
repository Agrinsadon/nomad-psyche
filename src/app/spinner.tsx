import React from "react";

const Spinner: React.FC = () => {
  return (
    <>
      <div className="spinner">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            style={{
              "--delay": `${(i + 1) * 0.1}s`,
              "--rotation": `${36 * (i + 1)}deg`,
              "--translation": "150%",
            } as React.CSSProperties}
          />
        ))}
      </div>

      <style jsx>{`
        .spinner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 9px;
          height: 9px;
        }
        .spinner div {
          position: absolute;
          width: 50%;
          height: 150%;
          background: #000000;
          transform: rotate(var(--rotation)) translate(0, var(--translation));
          animation: spinner-fzua35 1s var(--delay) infinite ease;
        }
        @keyframes spinner-fzua35 {
          0%, 10%, 20%, 30%, 50%, 60%, 70%, 80%, 90%, 100% {
            transform: rotate(var(--rotation)) translate(0, var(--translation));
          }
          50% {
            transform: rotate(var(--rotation)) translate(0, calc(1.5 * var(--translation)));
          }
        }
      `}</style>
    </>
  );
};

export default Spinner;
