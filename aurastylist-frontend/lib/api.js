import axios from 'axios';
import { ENDPOINTS } from './endpoints';

export const analyzeBody = async (imageData) => {
    const response = await axios.post(ENDPOINTS.ANALYZE_BODY, { image: imageData });
    return response.data;
};

export const getStyleReport = async (profileData) => {
    const response = await axios.post(ENDPOINTS.STYLE_REPORT, profileData);
    return response.data;
};
