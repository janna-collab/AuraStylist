export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const ENDPOINTS = {
  ANALYZE_BODY: `${API_BASE_URL}/analyze/body`,
  STYLE_REPORT: `${API_BASE_URL}/style/report`,
  STYLE_OUTFITS: `${API_BASE_URL}/style/outfits`,
  GALLERY_GENERATE: `${API_BASE_URL}/gallery/generate`,
  SHOP_ACTIVATE: `${API_BASE_URL}/shop/activate`,
  CHAT_MESSAGE: `${API_BASE_URL}/chat/message`,
  CHAT_VOICE: `${API_BASE_URL}/chat/voice`,
};
