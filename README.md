# Dev Utilities

Một công cụ web đơn giản giúp trích xuất và biên dịch các class của Tailwind CSS từ đoạn mã HTML thành CSS thuần. Công cụ này đặc biệt hữu ích khi bạn muốn sử dụng styling của Tailwind trong các môi trường không hỗ trợ build step của Tailwind (như email templates, legacy platforms, hay simple landing pages).

## 🚀 Tính Năng Chính

- **HTML to CSS**: Nhập mã HTML chứa class Tailwind, nhận về mã CSS đã biên dịch.
- **Prefix Support**: Tự động thêm prefix vào các class (ví dụ: `text-red-500` -> `.tw-text-red-500`).
- **Clean Output**: Chỉ xuất ra CSS của các utility class, loại bỏ hoàn toàn các style reset mặc định (Preflight) và các biến toàn cục không cần thiết.
- **Live Preview & Download**: Xem trước CSS kết quả và tải về dưới dạng file `.css`.
- **Dark Mode**: Giao diện hỗ trợ Dark/Light mode tự động.

## 🛠 Phân Tích Kỹ Thuật (How It Works)

Core logic nằm trong component `src/components/CssGenerator.tsx`. Quy trình hoạt động như sau:

### 1. Class Extraction (Trích xuất Class)
- Hệ thống sử dụng Regex để quét chuỗi HTML đầu vào và tìm các attribute `class="..."` hoặc `className="..."`.
- Tách chuỗi thành danh sách các class name độc lập.

### 2. Sandbox Compilation (Biên dịch trong môi trường cô lập)
Để biên dịch Tailwind classes thành CSS mà không cần backend nodejs, chúng tôi sử dụng kỹ thuật **Iframe Sandbox**:
1.  Tạo một `iframe` ẩn trong DOM.
2.  Inject một document HTML vào iframe này, bao gồm:
    -   Script **Tailwind CSS CDN** (phiên bản 3.x).
    -   Cấu hình Tailwind: `corePlugins: { preflight: false }`. Điều này cực kỳ quan trọng để ngăn Tailwind tự động thêm các style reset (như `margin: 0` cho body, reset heading, v.v.), đảm bảo output chỉ chứa style của class user yêu cầu.
    -   Body chứa các thẻ `div` giả lập (dummy elements) được gán các class đã trích xuất từ bước 1.

### 3. CSS Capture & Post-Processing (Thu thập và Xử lý CSS)
- Script liên tục kiểm tra (polling) iframe để xem khi nào Tailwind CDN hoàn tất việc inject styles vào thẻ `<style>`.
- **Filtering**:
    -   Lọc nội dung các thẻ `<style>`.
    -   **Strict Cleaning**: Sử dụng Regex để loại bỏ các selector toàn cục (`*`, `::before`, `::after`) và `::backdrop` mà Tailwind CDN thường inject để khai báo biến. Kết quả là file CSS sạch, chỉ chứa định nghĩa class.
- **Prefixing (Hậu xử lý)**:
    -   Nếu người dùng yêu cầu prefix (ví dụ `tw-`), hệ thống sẽ parse CSS và thay thế các selector `.ClassName` thành `.PrefixClassName` một cách an toàn để tránh lỗi với các escape characters của CSS (như `\.`, `\:`, `\/`).

## 📦 Project Structure

```
src/
├── components/
│   └── CssGenerator.tsx  # Component chính chứa logic xử lý
├── index.css             # CSS global của ứng dụng (chứa Tailwind directives)
├── App.tsx               # Root component
└── main.tsx              # Entry point
```

## 💻 Cài đặt và Chạy Local

Dự án sử dụng **Vite** và **Yarn**.

1. Clone repo:
   ```bash
   git clone <repo-url>
   cd dev-utilities
   ```

2. Cài đặt dependencies:
   ```bash
   yarn install
   ```

3. Chạy development server:
   ```bash
   yarn dev
   ```

4. Build production:
   ```bash
   yarn build
   ```

## 📝 Ghi chú
- Công cụ sử dụng Tailwind CSS CDN cho việc biên dịch runtime, do đó cần kết nối internet để hoạt động.
- Phiên bản Tailwind sử dụng là phiên bản mới nhất từ CDN (thường là v3).
