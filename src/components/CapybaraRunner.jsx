/**
 * Chú capybara chạy dọc đáy màn hình khi lời nhắn đặc biệt được mở.
 * Dùng file GIF có sẵn phần chân chạy, phần di chuyển ngang do CSS đảm nhiệm.
 */
export default function CapybaraRunner({ active, message, onPick }) {
  if (!active) return null;

  return (
    <div className="capybara-layer">
      <button
        type="button"
        className="capybara capybara--a"
        onClick={onPick}
        aria-label="Mở lời nhắn đặc biệt"
      >
        {message ? (
          <span className="capybara__bubble" aria-hidden="true">
            {message}
          </span>
        ) : null}
        <span className="capybara__body" aria-hidden="true">
          <img className="capybara__img" src="/images/capybara.gif" alt="" />
        </span>
      </button>
      <button
        type="button"
        className="capybara capybara--b"
        onClick={onPick}
        aria-label="Mở lời nhắn đặc biệt"
        tabIndex={-1}
      >
        <span className="capybara__body" aria-hidden="true">
          <img className="capybara__img" src="/images/capybara.gif" alt="" />
        </span>
      </button>
    </div>
  );
}
