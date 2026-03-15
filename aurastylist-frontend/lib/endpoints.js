export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const ENDPOINTS = {
  ANALYZE_BODY: `${API_BASE_URL}/api/analyze/body`,
  STYLE_REPORT: `${API_BASE_URL}/api/style/report`,
  STYLE_OUTFITS: `${API_BASE_URL}/api/style/outfits`,
  GALLERY_GENERATE: `${API_BASE_URL}/api/gallery/generate`,
  SHOP_ACTIVATE: `${API_BASE_URL}/api/shop/activate`,
  CHAT_MESSAGE: `${API_BASE_URL}/api/chat/message`,
  CHAT_VOICE: `${API_BASE_URL}/api/chat/voice`,
};
