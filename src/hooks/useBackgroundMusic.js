import { useCallback, useEffect, useRef, useState } from "react";

const MISSING_HINT =
  "Chưa phát được nhạc. Có thể file nhạc chưa sẵn sàng — em thử bấm lại giúp anh nhé.";

const MAX_VOLUME = 0.45;
const FADE_IN = 700;
const FADE_OUT = 420;

export default function useBackgroundMusic(
  src = "/music/background.mp3",
  { autoplay = true } = {}
) {
  const audioRef = useRef(null);
  const attemptedRef = useRef(false);
  const autoplayRef = useRef(autoplay);
  const indexRef = useRef(0);
  const fadeRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  const sources = Array.isArray(src) ? src : [src];
  const key = sources.join("|");

  const fadeTo = useCallback((target, ms, onDone) => {
    const audio = audioRef.current;
    if (!audio) return;
    cancelAnimationFrame(fadeRef.current);
    const from = audio.volume;
    const started = performance.now();
    const step = (now) => {
      // Timestamp của rAF có thể nhỏ hơn performance.now() lúc bắt đầu —
      // phải kẹp về [0, 1] để không gán volume âm (sẽ văng DOMException).
      const t = Math.min(1, Math.max(0, (now - started) / ms));
      const volume = Math.min(1, Math.max(0, from + (target - from) * t));
      audio.volume = volume;
      if (t < 1) {
        fadeRef.current = requestAnimationFrame(step);
      } else {
        audio.volume = target;
        onDone?.();
      }
    };
    fadeRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const list = sources.length ? sources : ["/music/background.mp3"];
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0;
    audio.preload = autoplayRef.current ? "auto" : "none";
    indexRef.current = 0;

    const loadCurrent = () => {
      audio.src = list[indexRef.current];
      audio.load();
    };

    const handlePlay = () => {
      setPlaying(true);
      setError("");
    };
    const handlePause = () => setPlaying(false);
    const handleError = () => {
      setPlaying(false);

      // Thử nguồn kế tiếp (mp3 → m4a → …)
      if (indexRef.current + 1 < list.length) {
        indexRef.current += 1;
        loadCurrent();
        if (attemptedRef.current) audio.play().catch(() => {});
        return;
      }

      if (attemptedRef.current || autoplayRef.current) setError(MISSING_HINT);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handlePause);
    audio.addEventListener("error", handleError);
    audioRef.current = audio;
    loadCurrent();

    if (import.meta.env?.DEV) window.__bgAudio = audio;

    // Tự phát khi mở trang. Trình duyệt có thể chặn (chưa tương tác) —
    // lúc đó im lặng, người nhận bấm nút hoặc mở một tấm ảnh là chạy.
    if (autoplayRef.current) {
      audio
        .play()
        .then(() => fadeTo(MAX_VOLUME, FADE_IN))
        .catch((err) => {
          if (err && err.name === "NotAllowedError") return;
          attemptedRef.current = true;
          setError(MISSING_HINT);
        });
    }

    return () => {
      cancelAnimationFrame(fadeRef.current);
      audio.pause();
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handlePause);
      audio.removeEventListener("error", handleError);
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    attemptedRef.current = true;
    try {
      await audio.play();
      setError("");
      fadeTo(MAX_VOLUME, FADE_IN);
    } catch {
      setPlaying(false);
      setError(
        "Chưa phát được nhạc. Có thể file nhạc chưa sẵn sàng — em thử bấm lại giúp anh nhé."
      );
    }
  }, [fadeTo]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    fadeTo(0, FADE_OUT, () => audio.pause());
  }, [fadeTo]);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      pause();
      return;
    }

    await play();
  }, [play, pause]);

  return { playing, error, toggle, play, pause };
}
