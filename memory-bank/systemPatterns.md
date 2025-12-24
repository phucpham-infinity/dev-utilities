# System Patterns

## Architecture
Ứng dụng hoạt động hoàn toàn Client-side.

### 1. Sandbox Compilation Pattern
Để biên dịch Tailwind Classes dynamic mà không cần Server-side Node.js:
- **Cơ chế**: Tạo một hidden `<iframe>`.
- **Injection**: Inject Tailwind CDN script và HTML của user vào iframe.
- **Config**: Tắt `preflight` để tránh global styles.
- **Extraction**: Đọc nội dung thẻ `<style>` được gen ra bởi CDN script.
- **Cleanup**: Dùng Regex lọc bỏ các biến global không cần thiết.

### 2. Component Structure
- `CssGenerator`: Container chính.
- `InputSection`: Nhập HTML và cấu hình Prefix.
- `OutputSection`: Hiển thị kết quả (Tab CSS / HTML).
- `useCssGenerator`: Custom hook chứa toàn bộ logic state và side-effects.

## Codebase Standards
- **Path Alias**: Sử dụng `@/` để import từ `src/` (đã config trong `vite.config.ts` và `tsconfig`).
- **Imports**: Sử dụng `import type` cho các Type/Interface (tuân thủ `verbatimModuleSyntax`).
- **Styling**: Sử dụng Tailwind CSS cho giao diện chính.
