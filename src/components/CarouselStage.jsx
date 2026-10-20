import { useEffect, useRef, useState } from "react";
import CircularCarousel from "./CircularCarousel";
import { carouselItems } from "../data/carouselItems";

export default function CarouselStage({ onPick }) {
  const stageRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(200);

  useEffect(() => {
    const element = stageRef.current;
    if (!element || typeof ResizeObserver === "undefined") return undefined;

    const update = () => {
      const { width, height } = element.getBoundingClientRect();
      if (!width || !height) return;
      const next = Math.round(
        Math.max(92, Math.min(width * 0.19, height * 0.28, 250))
      );
      setCardWidth((current) => (current === next ? current : next));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="orbit-stage">
      <div ref={stageRef} className="orbit-field">
        <div className="orbit-aura" aria-hidden="true" />

        <CircularCarousel
          items={carouselItems}
          preset="orbit"
          tilt={-22}
          perspective={1400}
          intro="none"
          cardWidth={cardWidth}
          aspectRatio={0.76}
          gap={Math.round(cardWidth * 0.13)}
          spacing={Math.max(0.62, Math.min(1, (0.66 * 12) / carouselItems.length))}
          offsetX={Math.max(10, Math.round(cardWidth * 0.075))}
          speed={7}
          autoplay="drift"
          direction="left"
          parallax={0.28}
          stretch={0.4}
          hoverSpread={0.32}
          hoverZoom={0.09}
          depthFade={0.46}
          fadeColor="rgba(58, 22, 40, 0.92)"
          innerShade={0.8}
          cornerRadius={10}
          ariaLabel="Vòng ảnh kỷ niệm 20 tháng 10"
          onItemClick={onPick}
        />
      </div>
      <p className="sr-only">
        Dùng phím mũi tên để xoay vòng ảnh, nhấn Enter để mở lời nhắn của ảnh
        đang chọn. Trên máy tính, rê chuột vào vòng để các ảnh mở ra.
      </p>
    </div>
  );
}
