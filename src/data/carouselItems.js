/**
 * Ảnh trong vòng xoay. Mỗi ảnh gắn với đúng một lời nhắn riêng —
 * chạm vào ảnh nào thì mở lời nhắn của ảnh đó.
 *
 * Ảnh gốc nằm ở ../Image, bản đã thu nhỏ nằm trong public/images/memories/.
 */
import { memoryLetterIds } from "./memoryLetters";
import { wishes } from "./wishes";

const photos = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "11", "13"];

const letterById = new Map(wishes.map((item) => [item.id, item]));

export const carouselItems = photos.map((file) => ({
  id: `memory-${file}`,
  src: `/images/memories/${file}.jpg`,
  alt: `Kỷ niệm ${file}`,
  wish: letterById.get(memoryLetterIds[file]),
}));

export const TOTAL_LETTERS = carouselItems.length;
