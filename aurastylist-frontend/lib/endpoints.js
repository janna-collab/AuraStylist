export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const ENDPOINTS = {
  ANALYZE_BODY: `${API_BASE_URL}/api/analyze/body`,
  STYLE_REPORT: `${API_BASE_URL}/api/style/report`,
  STYLE_OUTFITS: `${API_BASE_URL}/api/style/outfits`,
  GALLERY: `${API_BASE_URL}/api/gallery`,
  GALLERY_GENERATE: `${API_BASE_URL}/api/gallery/generate`,
  GALLERY_REGENERATE: `${API_BASE_URL}/api/gallery/regenerate`,
  GALLERY_SAVE: `${API_BASE_URL}/api/gallery/save`,
  GALLERY_SAVED: `${API_BASE_URL}/api/gallery/saved`,
  GALLERY_SAVED_SINGLE: `${API_BASE_URL}/api/gallery/saved-outfit`,
  SHOP_ACTIVATE: `${API_BASE_URL}/api/shop/activate`,
   CHAT_MESSAGE: `${API_BASE_URL}/api/chat/message`,
   CHAT_VOICE: `${API_BASE_URL}/api/chat/voice`,
   STYLE_REQUEST: `${API_BASE_URL}/api/style/request/`,
};
