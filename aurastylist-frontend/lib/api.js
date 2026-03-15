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

export const createStyleRequestAPI = async (data) => {
    const formData = new FormData();
    formData.append("target_type", data.target_type || "myself");
    formData.append("venue", data.venue);
    formData.append("aesthetic", data.aesthetic);
    
    // Conditional fields
    if (data.gender) formData.append("gender", data.gender);
    if (data.height) formData.append("height", data.height);
    if (data.size) formData.append("size", data.size);
    if (data.dress_type) formData.append("dress_type", data.dress_type);
    if (data.price_range) formData.append("price_range", data.price_range);
    
    if (data.reference_image) {
        formData.append("reference_image", data.reference_image);
    }
    if (data.target_image) {
        formData.append("target_image", data.target_image);
    }

    const response = await axios.post(ENDPOINTS.STYLE_REQUEST, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
