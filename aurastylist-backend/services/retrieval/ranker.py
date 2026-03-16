import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class RankingEngine:
    @staticmethod
    def rank_products(
        candidates: List[Dict[str, Any]],
        target_metadata: Dict[str, str],
        embedding_score_weight: float = 0.6
    ) -> List[Dict[str, Any]]:
        """
        Ranks products based on the formula: embedding_similarity + metadata_similarity.
        """
        refined_results = []
        
        for item in candidates:
            # 1. Base score from vector search (embedding similarity)
            base_score = item.get("score", 0.5)
            
            # 2. Metadata similarity score (category, color, style, material)
            metadata_score = 0
            
            # Category match (critical)
            if item.get("category", "").lower() == target_metadata.get("type", "").lower():
                metadata_score += 0.4
            
            # Color tone match
            if item.get("color", "").lower() == target_metadata.get("color", "").lower():
                metadata_score += 0.2
                
            # Material match
            if item.get("material", "").lower() == target_metadata.get("material", "").lower():
                metadata_score += 0.2
                
            # Style/Silhouette match
            if item.get("style", "").lower() == target_metadata.get("style", "").lower():
                metadata_score += 0.2

            # Final Ranking Formula: weighted embedding + normalized metadata score
            # We cap metadata score at 1.0
            final_score = (base_score * embedding_score_weight) + (min(metadata_score, 1.0) * (1 - embedding_score_weight))
            
            item["final_score"] = final_score
            refined_results.append(item)
            
        # Sort by final score descending
        refined_results.sort(key=lambda x: x["final_score"], reverse=True)
        return refined_results
