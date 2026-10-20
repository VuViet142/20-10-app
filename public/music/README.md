# Nhạc nền

Đặt file nhạc của bạn vào thư mục này. Website thử theo thứ tự và tự chuyển
sang lựa chọn kế tiếp nếu lựa chọn trước không phát được:

```text
public/music/background.mp3
public/music/background.m4a
```

Chỉ cần có **một** trong hai file là chạy. `.m4a` là AAC trong container MP4 —
trình duyệt Chrome, Edge, Safari và Firefox đều phát được.

Website chỉ phát nhạc sau khi người nhận bấm nút — không autoplay.

Nếu file chưa có, trang vẫn hoạt động bình thường và nút nhạc sẽ hiện một
thông báo nhẹ nhàng. Chỉ dùng bản nhạc bạn sở hữu hoặc có giấy phép sử dụng.

## Dùng tên hoặc định dạng khác

Sửa `musicSrc` trong `src/data/site.js`:

```js
musicSrc: ["/music/ngay-20-10.m4a", "/music/ngay-20-10.mp3"],
```

Mảng được thử theo thứ tự, file đầu tiên phát được sẽ được dùng.
