import { useEffect, useMemo, useRef } from "react";
import "./DreamBackground.css";

const HEART_PATH =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

const SPARK_PATH =
  "M12 0c.9 6.2 5.8 11.1 12 12-6.2.9-11.1 5.8-12 12-.9-6.2-5.8-11.1-12-12C6.2 11.1 11.1 6.2 12 0Z";

const SPARK_TINTS = [
  "#ff5f9e",
  "#ffd79a",
  "#b98cff",
  "#ffffff",
  "#ff8fb1",
  "#ffe9c4",
];

function makeRandom(seed) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function between(random, [min, max]) {
  return min + random() * (max - min);
}

const HEART_LAYERS = [
  {
    key: "far",
    count: 14,
    seed: 23,
    size: [16, 30],
    alpha: [0.16, 0.3],
    rise: [20, 30],
    sway: [5, 9],
    swayX: [8, 22],
    blur: 1.4,
    tint: "#efa3c0",
  },
  {
    key: "mid",
    count: 11,
    seed: 61,
    size: [28, 50],
    alpha: [0.24, 0.42],
    rise: [15, 24],
    sway: [4.5, 8],
    swayX: [14, 34],
    blur: 0,
    tint: "#e888ae",
  },
  {
    key: "near",
    count: 7,
    seed: 107,
    size: [62, 104],
    alpha: [0.12, 0.2],
    rise: [12, 19],
    sway: [4, 7],
    swayX: [22, 54],
    blur: 2.5,
    tint: "#f6bed3",
  },
];

const ORBS = [
  {
    x: 16,
    y: 24,
    size: 360,
    alpha: 0.5,
    tint: "255, 255, 255",
    float: [22, -18],
    duration: 19,
  },
  {
    x: 84,
    y: 20,
    size: 300,
    alpha: 0.42,
    tint: "255, 214, 231",
    float: [-26, 16],
    duration: 23,
  },
  {
    x: 72,
    y: 72,
    size: 420,
    alpha: 0.4,
    tint: "249, 182, 208",
    float: [-18, -28],
    duration: 26,
  },
  {
    x: 28,
    y: 82,
    size: 380,
    alpha: 0.36,
    tint: "243, 166, 192",
    float: [24, -14],
    duration: 21,
  },
  {
    x: 52,
    y: 46,
    size: 260,
    alpha: 0.5,
    tint: "255, 255, 255",
    float: [14, 20],
    duration: 17,
  },
  {
    x: 92,
    y: 56,
    size: 240,
    alpha: 0.34,
    tint: "255, 226, 239",
    float: [-16, 12],
    duration: 24,
  },
];

function buildLayers() {
  return HEART_LAYERS.map((layer) => {
    const random = makeRandom(layer.seed);
    return {
      key: layer.key,
      tint: layer.tint,
      blur: layer.blur,
      hearts: Array.from({ length: layer.count }, (_, index) => ({
        id: `${layer.key}-${index}`,
        left: between(random, [3, 95]),
        bottom: between(random, [-16, -4]),
        size: between(random, layer.size),
        alpha: between(random, layer.alpha),
        rise: between(random, layer.rise),
        riseDelay: -random() * 30,
        sway: between(random, layer.sway),
        swayDelay: -random() * 8,
        swayX: between(random, layer.swayX),
        rotate: between(random, [-14, 14]),
      })),
    };
  });
}

function buildSparkles() {
  const random = makeRandom(151);
  return Array.from({ length: 34 }, (_, index) => ({
    id: index,
    left: between(random, [2, 97]),
    top: between(random, [3, 80]),
    size: between(random, [4, 13]),
    alpha: between(random, [0.4, 0.95]),
    duration: between(random, [2.4, 6.2]),
    delay: -random() * 6,
    tint: SPARK_TINTS[Math.floor(random() * SPARK_TINTS.length)],
  }));
}

export default function DreamBackground() {
  const rootRef = useRef(null);
  const layers = useMemo(buildLayers, []);
  const sparkles = useMemo(buildSparkles, []);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    if (reduce.matches || !fine.matches) return undefined;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;
    let running = false;

    const tick = () => {
      currentX += (targetX - currentX) * 0.075;
      currentY += (targetY - currentY) * 0.075;
      element.style.setProperty("--mx", currentX.toFixed(4));
      element.style.setProperty("--my", currentY.toFixed(4));

      if (
        Math.abs(targetX - currentX) > 0.001 ||
        Math.abs(targetY - currentY) > 0.001
      ) {
        frame = window.requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const kick = () => {
      if (running) return;
      running = true;
      frame = window.requestAnimationFrame(tick);
    };

    const onMove = (event) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;
      kick();
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      kick();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onLeave);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="dream-bg" ref={rootRef} aria-hidden="true">
      <div className="dream-aurora dream-aurora--rose" />
      <div className="dream-aurora dream-aurora--violet" />
      <div className="dream-aurora dream-aurora--gold" />
      <div className="dream-shimmer" />
      <div className="dream-glow" />

      <div className="dream-layer dream-layer--orbs" style={{ "--depth": "10px" }}>
        {ORBS.map((orb, index) => (
          <span
            key={index}
            className="dream-orb"
            style={{
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              "--orb-tint": orb.tint,
              "--orb-alpha": orb.alpha,
              "--float-x": `${orb.float[0]}px`,
              "--float-y": `${orb.float[1]}px`,
              "--float-dur": `${orb.duration}s`,
            }}
          />
        ))}
      </div>

      {layers.map((layer, layerIndex) => (
        <div
          key={layer.key}
          className={`dream-layer dream-hearts dream-hearts--${layer.key}`}
          style={{ "--depth": `${8 + layerIndex * 8}px` }}
        >
          {layer.hearts.map((heart) => (
            <span
              key={heart.id}
              className="dream-heart"
              style={{
                left: `${heart.left}%`,
                bottom: `${heart.bottom}vh`,
                width: `${heart.size}px`,
                height: `${heart.size}px`,
                "--alpha": heart.alpha,
                "--rise": `${heart.rise}s`,
                "--rise-delay": `${heart.riseDelay}s`,
                "--sway": `${heart.sway}s`,
                "--sway-delay": `${heart.swayDelay}s`,
                "--sway-x": `${heart.swayX}px`,
                "--rot": `${heart.rotate}deg`,
                "--heart-tint": layer.tint,
                "--heart-blur": `${layer.blur}px`,
              }}
            >
              <span className="dream-heart__sway">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d={HEART_PATH} />
                </svg>
              </span>
            </span>
          ))}
        </div>
      ))}

      <div className="dream-layer dream-sparkles" style={{ "--depth": "18px" }}>
        {sparkles.map((sparkle) => (
          <span
            key={sparkle.id}
            className="dream-sparkle"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              "--spark-alpha": sparkle.alpha,
              "--twinkle": `${sparkle.duration}s`,
              "--twinkle-delay": `${sparkle.delay}s`,
              "--spark-tint": sparkle.tint,
            }}
          >
            <svg viewBox="0 0 24 24" focusable="false">
              <path d={SPARK_PATH} />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
