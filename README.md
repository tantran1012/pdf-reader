# 📚 PDF Reader

Một ứng dụng đọc file PDF cho máy yếu được xây dựng bằng [Next.js](https://nextjs.org/)

# 🎠 Demo

[PDF reader](https://pdf-reader-murex.vercel.app/)

## 🚀 Tính năng chính

- Hiển thị file PDF trực tiếp trên trình duyệt cho máy yếu
- Xem bookmark có sẵn trên file

## 🎭 Nhược điểm

- Thao tác nhảy đến trang bất kỳ sẽ chậm hơn.

## 🛠️ Công nghệ sử dụng

- [Next.js](https://nextjs.org/)
- TypeScript
- JavaScript
- CSS
- pnpm / npm / yarn

## 📦 Cài đặt & chạy dự án

```bash
# Clone repo
git clone https://github.com/tantran1012/pdf-reader.git
cd pdf-reader

# Cài đặt dependencies
npm install
# hoặc
pnpm install
# hoặc
yarn install

# Chạy server phát triển
npm run dev
# hoặc
pnpm dev
# hoặc
yarn dev
```

## 🐛 lỗi đã phát hiện (sẽ sửa sau)

- Không Highlight bookmark trang hiện tại
- Giật lag khi render trang bất kì ở xa
- Chưa thao tác được liên kết trực tiếp trên trang pdf
