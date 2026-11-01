# Blue Hour — The World of Ju Jingyi

Template web fan-made, phong cách cinematic: nền xanh xám, trắng ngà, ánh bạc.
HTML/CSS/JS thuần, không cần build.

## Có gì trong trang
- Màn hình chào "Enter" (trình duyệt chặn tự phát nhạc, nên cần 1 cú bấm), sau đó video toàn màn hình + nhạc bắt đầu.
- Tên `JU JINGYI` hiện dần từ mờ sang nét, từng chữ một.
- Quote hiện theo giây của bản nhạc. Khi chạy qua http(s), phần bass của nhạc làm tên và ánh sáng nền đập nhẹ theo nhịp.
- Cuộn xuống: gallery dạng triển lãm 5 "phòng" (ảnh bắt đầu xanh xám, màu trả lại dần khi tới giữa màn hình, bấm để phóng to; đổi bố cục ở `frames.rooms` trong `config.js`) rồi puzzle ghép ảnh (đổi ảnh, 3 mức khó, kéo thả hoặc bấm hai mảnh để hoán đổi). Ghép xong sẽ mở ra lá thư chúc mừng, sửa ở `puzzle` trong `config.js`.
- Tôn trọng `prefers-reduced-motion`, có nút tắt tiếng.

## Chạy thử
Chạy qua server cục bộ (mở thẳng file `index.html` thì hiệu ứng nhịp nhạc bị tắt):

    python3 -m http.server 8000
    # mở http://localhost:8000

## Đổi nội dung (đổi idol)
Mọi chữ, đường dẫn ảnh, quote, mốc thời gian nằm trong `js/config.js`.
Thay file trong `assets/` (giữ tên hoặc sửa đường dẫn trong config).

### Căn quote theo nhịp nhạc
Mở `http://localhost:8000/?debug`, bấm Enter, nghe và ghi lại giây của từng nhịp mạnh,
rồi sửa `t` (giây bắt đầu) và `d` (thời lượng) của từng quote trong `config.js`.
Nhạc lặp lại thì quote cũng lặp lại theo.

## Đưa lên GitHub Pages
1. Tạo repo, đẩy toàn bộ thư mục này lên nhánh `main`.
2. Settings > Pages > Source: `Deploy from a branch`, chọn `main` / `/ (root)`.
3. Mở `https://<user>.github.io/<repo>/`.

## Lưu ý trước khi công khai
- Video gốc có watermark TikTok `@tiendoxanlan` ở góc dưới trái. Nên xin phép chủ video hoặc thay bằng bản gốc `assets/video/hero.mp4`.
- Ảnh, video, nhạc thuộc về chủ sở hữu. Dùng phi thương mại thì thường ổn, còn bán lại template thì nên dùng tư liệu có bản quyền rõ ràng.
- Quote và lá thư trong `config.js` chỉ là nội dung mẫu, hãy viết lại bằng lời của bạn.
- Ảnh đã nén về cạnh dài tối đa 1600px. Có thể đổi sang WebP để nhẹ hơn.

## Video hero
- `assets/video/hero.mp4` đã được cắt bỏ 3 giây cuối (còn khoảng 26 giây) và bỏ tiếng để nhẹ hơn.
- Trên màn hình dọc (điện thoại) video hiện trọn khung 16:9, phần thừa phía trên và dưới được lấp bằng bản mờ của chính video.
