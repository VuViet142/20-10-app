import { useEffect, useRef, useState } from "react";
import CapybaraRunner from "./components/CapybaraRunner";
import CarouselStage from "./components/CarouselStage";
import DreamBackground from "./components/DreamBackground";
import MusicControl from "./components/MusicControl";
import WishCard from "./components/WishCard";
import { TOTAL_LETTERS } from "./data/carouselItems";
import { site } from "./data/site";
import { specialWish } from "./data/wishes";
import useBackgroundMusic from "./hooks/useBackgroundMusic";

const SPECIAL_IMAGE = "/images/bo-hoa.jpg";

export default function App() {
  const [wish, setWish] = useState(null);
  const [opened, setOpened] = useState(() => new Set());
  const [pickedImage, setPickedImage] = useState(null);
  const [specialOpened, setSpecialOpened] = useState(false);

  const specialRef = useRef(false);
  const specialTimer = useRef(null);
  const { playing, error, toggle, play } = useBackgroundMusic(site.musicSrc, {
    autoplay: true,
  });

  const handlePick = (item) => {
    // Mỗi ảnh có đúng một lời nhắn riêng
    setWish(item.wish);
    setPickedImage(item.src);

    // Mở ảnh là một cú bấm thật — trình duyệt cho phát nhạc ở đây
    play();

    setOpened((current) => {
      if (current.has(item.id)) return current;
      const updated = new Set(current);
      updated.add(item.id);
      return updated;
    });
  };

  const handleCapybaraPick = () => {
    setWish(specialWish);
    setPickedImage(SPECIAL_IMAGE);
  };

  // Đủ 11 lời nhắn thì capybara chạy ra trước — bấm vào chú mới mở lời đặc biệt
  useEffect(() => {
    if (opened.size < TOTAL_LETTERS || specialRef.current) return;

    specialRef.current = true;
    specialTimer.current = window.setTimeout(() => {
      setSpecialOpened(true);
    }, 500);
  }, [opened]);

  useEffect(
    () => () => {
      window.clearTimeout(specialTimer.current);
    },
    []
  );

  return (
    <main className={`orbit-page${wish ? " is-reading" : ""}`}>
      <DreamBackground />
      <CarouselStage onPick={handlePick} />

      {wish ? (
        <WishCard
          wish={wish}
          imageSrc={pickedImage}
          isSpecial={wish.id === specialWish.id}
          openedCount={opened.size}
          totalLetters={TOTAL_LETTERS}
          onClose={() => {
            setWish(null);
            setPickedImage(null);
          }}
        />
      ) : null}

      <MusicControl playing={playing} error={error} onToggle={toggle} />
      <CapybaraRunner
        active={specialOpened}
        message="Đố em bắt được anh"
        onPick={handleCapybaraPick}
      />
    </main>
  );
}
