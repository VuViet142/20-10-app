export default function MusicControl({ playing, error, onToggle }) {
  return (
    <div className={`music${playing ? " is-playing" : ""}`}>
      {error ? (
        <p className="music__note" role="status">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        className="music__btn"
        onClick={onToggle}
        aria-pressed={playing}
        aria-label={playing ? "Tạm dừng nhạc nền" : "Bật nhạc nền"}
      >
        <span className="music__icon" aria-hidden="true">
          {playing ? (
            <svg viewBox="0 0 16 16" width="12" height="12">
              <rect x="3" y="2" width="3.4" height="12" rx="1.2" fill="currentColor" />
              <rect x="9.6" y="2" width="3.4" height="12" rx="1.2" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" width="12" height="12">
              <path d="M4 2.6c0-.9 1-1.4 1.7-.9l7 4.9c.6.4.6 1.3 0 1.7l-7 4.9c-.7.5-1.7 0-1.7-.9V2.6Z" fill="currentColor" />
            </svg>
          )}
        </span>
        <span className="music__label">{playing ? "Tạm dừng" : "Bật nhạc"}</span>
      </button>
    </div>
  );
}
