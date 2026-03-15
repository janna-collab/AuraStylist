class PromptFactory:
    @staticmethod
    def create_fashion_prompt(recommendation: str, aesthetic: str, venue: str, subject="a person") -> str:
        """Creates a highly detailed, professional fashion prompt for text-to-image generation."""
        return (
            f"High-end fashion editorial photo of {subject} wearing: {recommendation}. "
            f"Aesthetic: {aesthetic}. Scene: {venue}. "
            "Ultra-detailed, cinematic lighting, glossy runway-quality textures, realistic fabric details, and vibrant color contrast. "
            "Use professional studio photography style with natural human proportions. "
            "No cartoon, no text overlays, no artifacts."
        )

    @staticmethod
    def create_inpainting_prompt(recommendation: str, aesthetic: str, venue: str, gender: str = None, size: str = None) -> str:
        """Creates an inpainting prompt that preserves the subject while replacing attire."""
        detail_tags = []
        if gender:
            detail_tags.append(f"gender: {gender}")
        if size:
            detail_tags.append(f"size: {size}")
        detail_str = " ".join(detail_tags)

        return (
            "Generate a photorealistic full-body fashion edit on the provided reference photo. "
            "VERY IMPORTANT: keep the person's face, eyes, nose, mouth, and hairline unchanged and exactly the same as the original image. "
            "Do not alter facial identity, expression, or skin details. "
            f"Keep the original person's pose, body shape, skin tone, and silhouette exactly the same. "
            f"Replace only the clothing and accessories with {recommendation} for a {aesthetic} look at {venue}. "
            f"{detail_str} "
            "Add elegant styling details, polished couture finishing, and crisp high-resolution textures. "
            "The output must look like a real fashion editorial photo, preserving identity and facial features."
        )

    @staticmethod
    def get_standard_negative() -> str:
        """Standard fashion negative prompt."""
        return (
            "cartoon, illustration, drawing, 3d render, anime, low quality, "
            "deformed body, extra limbs, blurry face, distorted features, "
            "cluttered background, bad lighting, watermark, text, mutated hands."
        )

    @staticmethod
    def refine_outfit_description(vibe_analysis: str, user_request: str) -> str:
        """Refines a raw user request or vibe analysis into a clean outfit description."""
        return f"{user_request}. Inspired by: {vibe_analysis}. Focus on flattering silhouette, premium textures, and polished styling."
