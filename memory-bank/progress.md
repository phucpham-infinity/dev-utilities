# Progress Status

## Completed Features
- [x] **Core CSS Generation**: Cơ chế biên dịch CSS thông qua Iframe Sandbox.
- [x] **UI Interface**: Giao diện chính với Input/Output split view.
- [x] **Component Refactoring**: Tách `InputSection` và `OutputSection`.
- [x] **Custom Hooks**: `useCssGenerator` hook để quản lý logic.
- [x] **Prefixing Support**: Logic thêm prefix vào CSS Selector.
- [x] **HTML Output**: Logic thêm prefix vào HTML class attribute.
- [x] **Format Options**: Tùy chọn Beautify/Minify CSS.
- [x] **System Configuration**:
    - [x] Cấu hình TypeScript `verbatimModuleSyntax`.
    - [x] Cấu hình Path Alias `@` trỏ đến `src`.

## In Progress
- [ ] Tối ưu hóa performance khi input lớn.
- [ ] Cải thiện Regex parsing để trích xuất class chính xác hơn (hiện tại đang dựa vào regex đơn giản).

## Known Issues
- Phụ thuộc vào kết nối mạng để tải Tailwind CDN trong iframe.
