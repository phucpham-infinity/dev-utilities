# Active Context

## Current Session
- **Thời gian**: 2025-12-24
- **Mục tiêu**: Fix lỗi hệ thống, cấu hình dự án, và documented lại quá trình.

## Recent Changes
1.  **Fix TypeScript Error**: Sửa lỗi `OutputTab` import bằng cách dùng `import type` để tuân thủ `verbatimModuleSyntax`.
2.  **Path Alias Setup**:
    - Update `vite.config.ts`: Thêm alias `@` -> `./src`.
    - Update `tsconfig.app.json`: Thêm `baseUrl` . và `paths` `@/*`.
    - Refactor Code: Thay thế các Relative Imports (`../../`) bằng Alias Imports (`@/`).
3.  **Documentation**: Khởi tạo thư mục `memory-bank` để theo dõi dự án.

## Next Steps
- Tiếp tục phát triển tính năng theo yêu cầu user.
- Theo dõi tính ổn định của cơ chế Sandbox Iframe.
