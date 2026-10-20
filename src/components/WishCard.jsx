import { useEffect, useRef } from "react";
import { site } from "../data/site";
import { wishCategories } from "../data/wishes";

const HEART_PATH =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

export default function WishCard({
  wish,
  imageSrc,
  isSpecial,
  openedCount = 0,
  totalLetters = 0,
  onClose,
}) {
  const dialogRef = useRef(null);
  const closeHandler = useRef(onClose);
  closeHandler.current = onClose;

  useEffect(() => {
    const previous = document.activeElement;
    dialogRef.current?.focus();

    const onKey = (event) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      closeHandler.current();
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, []);

  const handleBackdrop = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  const handleTrap = (event) => {
    if (event.key !== "Tab" || !dialogRef.current) return;
    const nodes = dialogRef.current.querySelectorAll(
      'button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])'
    );
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className="wish-overlay"
      onPointerDown={handleBackdrop}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className="wish-letter"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wish-title"
        tabIndex={-1}
        onKeyDown={handleTrap}
      >
        <div className="wish-seal-slot">
          <div className="wish-seal" aria-hidden="true">
            <span>20-10</span>
          </div>
        </div>

        <div className="wish-body" key={wish.id}>
          <p className={`wish-kicker${isSpecial ? " is-special" : ""}`}>
            <span className="wish-kicker__emoji" aria-hidden="true">
              {wish.emoji}
            </span>
            {wishCategories[wish.category] ?? "Lời nhắn đặc biệt"}
          </p>
          <h2 className="wish-title" id="wish-title">
            {wish.title}
          </h2>

          {imageSrc ? (
            <div className="wish-photo-frame">
              <img
                className="wish-photo"
                src={imageSrc}
                alt={`Kỷ niệm gắn với: ${wish.title}`}
                loading="lazy"
                draggable={false}
              />
              <div className="wish-photo-cap">
                {wish.emoji}
              </div>
            </div>
          ) : null}

          <p className="wish-message">{wish.message}</p>
          <p className="wish-signature">
            {site.signature}
            <span className="wish-signature__heart" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d={HEART_PATH} />
              </svg>
            </span>
          </p>

          {!isSpecial ? (
            <p className="wish-note">
              {openedCount}/{totalLetters} lời nhắn đã mở
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
