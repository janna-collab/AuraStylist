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

export const generateStyleReportAPI = async (analysisData, height, shoeSize, preferredFit) => {
    const formData = new FormData();
    formData.append("analysis_data", analysisData);
    formData.append("height", height);
    formData.append("shoe_size", shoeSize);
    formData.append("preferred_fit", preferredFit);
    const response = await axios.post(ENDPOINTS.STYLE_REPORT, formData);
    return response.data;
};

export const generateOutfitsAPI = async (aesthetic, venue, dressType, priceRange, targetProfile) => {
    const formData = new FormData();
    formData.append("aesthetic", aesthetic);
    formData.append("venue", venue);
    formData.append("dress_type", dressType);
    formData.append("price_range", priceRange);
    if (targetProfile) {
        formData.append("target_profile", JSON.stringify(targetProfile));
    }
    const response = await axios.post(ENDPOINTS.STYLE_OUTFITS, formData);
    return response.data;
};
