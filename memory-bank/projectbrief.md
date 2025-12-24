# Project Brief: Tailwind CSS Generator

## Overview
Công cụ web giúp trích xuất và biên dịch các class Tailwind CSS từ HTML thành CSS thuần. Được thiết kế cho các trường hợp sử dụng Tailwind ở môi trường không có build step (như email template, legacy CMS).

## Core Features
- **HTML to CSS**: Nhập HTML -> Xuất CSS.
- **Prefix Isolation**: Tự động thêm prefix (namespace) cho class để tránh xung đột style.
- **Clean Output**: Loại bỏ Preflight/Reset CSS, chỉ giữ lại style cần thiết.
- **Prettify/Minify**: Định dạng code CSS đầu ra.
- **HTML Transformation**: Xuất lại HTML với class đã được thêm prefix.

## Stack
- **Frontend Framework**: React 19 + Vite.
- **Styling**: Tailwind CSS v4 (cho UI ứng dụng).
- **Core Engine**: Tailwind CSS CDN (v3.x) chạy trong Iframe Sandbox để biên dịch dynamic CSS.
