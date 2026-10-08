import { useEffect, useRef } from "react";

interface SiriWaveProps {
  isSpeaking?: boolean;
  isListening?: boolean;
  size?: number;
}

const SiriWave = ({
  isSpeaking = false,
  isListening = false,
  size = 200,
}: SiriWaveProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      const centerX = size / 2;
      const centerY = size / 2;

      const active = isSpeaking || isListening;
      const baseRadius = size * 0.32;

      ctx.beginPath();

      for (let i = 0; i <= 360; i++) {
        const angle = (i * Math.PI) / 180;

        const wave =
          active
            ? Math.sin(angle * 6 + phaseRef.current) * 5 +
              Math.sin(angle * 10 - phaseRef.current * 1.5) * 3
            : Math.sin(angle * 4 + phaseRef.current) * 1.5;

        const radius = baseRadius + wave;

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.closePath();

      ctx.strokeStyle = "rgba(59, 130, 246, 0.8)";
      ctx.lineWidth = 2;
      ctx.shadowBlur = active ? 18 : 8;
      ctx.shadowColor = "rgba(59, 130, 246, 0.7)";
      ctx.stroke();

      ctx.shadowBlur = 0;

      phaseRef.current += active ? 0.045 : 0.015;

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSpeaking, isListening, size]);

  return (
    <div
      className={`relative flex items-center justify-center transition-transform duration-700 ${
        isSpeaking || isListening ? "scale-110" : "scale-100"
      }`}
      style={{
        width: size,
        height: size,
      }}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="w-full h-full"
      />
    </div>
  );
};

export default SiriWave;