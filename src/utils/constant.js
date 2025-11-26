//sort ,const,...
// Sử dụng biến môi trường từ .env file
// Trong Vite, phải dùng import.meta.env và prefix VITE_
export const API_ROOT =
  import.meta.env.VITE_API_ROOT || "http://localhost:8017";
