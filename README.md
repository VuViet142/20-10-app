# A Little Love for You · 20/10

Một món quà nhỏ, tĩnh, không backend: người nhận xoay vòng ảnh kỷ niệm và
chạm vào từng khung để mở lời chúc tiếng Việt. Xây bằng React + Vite, CSS
thuần, phong cách hồng pastel.

## Chạy dự án

```bash
npm install
npm run dev
```

Mở địa chỉ Vite in ra (thường là `http://localhost:5173`).

```bash
npm run build     # build production
npm run preview   # xem thử bản build
```

## Cấu trúc

```text
public/
  images/          ảnh minh họa + ảnh kỷ niệm placeholder (SVG)
  music/           đặt background.mp3 tại đây
  favicon.svg
src/
  components/
    CircularCarousel.jsx  vòng xoay 3D (React Bits, đã Việt hóa aria-label)
    CircularCarousel.css  style riêng của vòng xoay
    CarouselStage.jsx     sân khấu: vòng ảnh + hình trang trí + gợi ý
    WishCard.jsx          lá thư hiển thị lời chúc
    MusicControl.jsx      nút bật/tạm dừng nhạc
  data/
    site.js         tiêu đề, lời dẫn, chữ ký, đường dẫn nhạc
    wishes.js       24 lời chúc theo 6 nhóm + lời nhắn đặc biệt
    carouselItems.js ảnh trong vòng xoay, nhóm lời chúc của từng ảnh
  hooks/
    useBackgroundMusic.js
  App.jsx
  main.jsx
  index.css
```

## Cá nhân hóa

1. **Tên / cách xưng hô** — sửa `titleHighlight`, `titleTail`, `signature`,
   `footer` trong `src/data/site.js`.
2. **Lời chúc** — sửa/thêm trong `src/data/wishes.js`. Mỗi mục thuộc một
   `category` (ngọt ngào, yêu thương, bình yên, động viên, tương lai, đáng
   yêu). Lời nhắn đặc biệt nằm ở `specialWish`.
3. **Số hình cần mở để nhận lời nhắn đặc biệt** — `specialThreshold` trong
   `site.js` (mặc định 6).
4. **Ảnh kỷ niệm** — đặt ảnh vào `public/images/`, rồi sửa `src`, `alt`,
   `title`, `subtitle`, `category` trong `src/data/carouselItems.js`. Nên
   dùng ảnh đã nén, ưu tiên JPG/WebP dọc (tỉ lệ ~4:5). Có thể thêm/bớt ảnh,
   vòng xoay tự tính lại bán kính.
5. **Nhạc** — thêm `public/music/background.mp3` (hoặc đổi `musicSrc` trong
   `site.js`). Không có file thì trang vẫn chạy, nút nhạc chỉ hiện gợi ý nhẹ.
6. **Vòng xoay** — tinh chỉnh props trong `src/components/CarouselStage.jsx`:
   `speed` (độ trôi), `preset` (`cylinder` / `orbit` / `wheel` / `panorama`),
   `direction`, `depthFade`, `parallax`, `innerShade`… `cardWidth` tự co
   theo bề rộng sân khấu.

Lưu ý quyền riêng tư: mọi file trong `public/` đều công khai khi deploy. Chỉ
dùng ảnh/nhạc bạn có quyền chia sẻ.

## Hành vi chính

- Vòng xoay tự trôi chậm; kéo chuột/ngón tay để xoay, lăn ngang trackpad để
  quay, hoặc dùng phím mũi tên khi vòng ảnh được focus.
- Chạm/chọn một khung ảnh → vòng xoay đưa ảnh đó ra trước và mở lời chúc ngẫu
  nhiên thuộc nhóm của ảnh, không lặp lại đúng lời vừa hiển thị.
- Mở đủ `specialThreshold` ảnh khác nhau → mở lời nhắn đặc biệt.
- Nút "Đọc lời chúc khác" lấy ngẫu nhiên một lời khác.
- Nhạc chỉ phát sau khi người nhận bấm nút (tuân thủ autoplay policy).
- Giảm chuyển động theo `prefers-reduced-motion` (tắt tự trôi, parallax, hiệu
  ứng xuất hiện).
- Trang hiển thị được trên mobile, tablet, desktop; không cuộn ngang.

## Deploy Vercel

Import repo → Framework Preset: **Vite** → Build: `npm run build` → Output:
`dist`.
