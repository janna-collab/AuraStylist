import base64
import logging
from typing import List, Optional
from services.nova.client import bedrock_client
from services.nova.config import NOVA_EMBEDDING

logger = logging.getLogger(__name__)

class EmbeddingService:
    @staticmethod
    def generate_image_embedding(image_bytes: bytes) -> Optional[List[float]]:
        """Generates a multimodal embedding for an image using Amazon Nova with Titan fallback."""
        models_to_try = [NOVA_EMBEDDING, "amazon.titan-embed-image-v1"]
        
        for model_id in models_to_try:
            try:
                encoded_image = base64.b64encode(image_bytes).decode("utf-8")
                
                # Request bodies differ slightly between Nova and Titan
                if "nova" in model_id:
                    body = {
                        "inputImage": encoded_image,
                        "embeddingConfig": {"outputEmbeddingLength": 1024}
                    }
                else:
                    body = {"inputImage": encoded_image}
                
                response = bedrock_client.invoke_model(
                    model_id=model_id,
                    body=body
                )
                
                if "embedding" in response:
                    return response["embedding"]
                
                logger.warning(f"Embedding model {model_id} returned no embedding. Trying next...")
                
            except Exception as e:
                logger.warning(f"Model {model_id} failed: {e}")
                continue
                
        logger.error("All embedding models failed.")
        return None

    @staticmethod
    def generate_text_embedding(text: str) -> Optional[List[float]]:
        """Generates a multimodal embedding for text with Titan fallback."""
        models_to_try = [NOVA_EMBEDDING, "amazon.titan-embed-image-v1"]
        
        for model_id in models_to_try:
            try:
                if "nova" in model_id:
                    body = {
                        "inputText": text,
                        "embeddingConfig": {"outputEmbeddingLength": 1024}
                    }
                else:
                    body = {"inputText": text}
                
                response = bedrock_client.invoke_model(
                    model_id=model_id,
                    body=body
                )
                
                if "embedding" in response:
                    return response["embedding"]
            except Exception as e:
                logger.warning(f"Text embedding model {model_id} failed: {e}")
                continue
        return None
