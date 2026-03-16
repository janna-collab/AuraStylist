class PromptFactory:
    @staticmethod
    def _gender_subject(gender: str = None) -> str:
        """Returns a precise gender-specific subject description."""
        if not gender:
            return "a fashion model"
        g = gender.strip().lower()
        if g in ("female", "woman", "girl"):
            return "a female fashion model"
        elif g in ("male", "man", "boy"):
            return "a male fashion model"
        return f"a {gender} fashion model"

    @staticmethod
    def create_fashion_prompt(recommendation: str, aesthetic: str, venue: str, subject: str = None, gender: str = None) -> str:
        """Creates a highly detailed, professional fashion prompt for text-to-image generation.
        Always generates full-body images."""
        subject_str = subject or PromptFactory._gender_subject(gender)
        gender_rule = ""
        if gender:
            g = gender.strip().lower()
            if g in ("female", "woman", "girl"):
                gender_rule = " The model is FEMALE — generate exclusively women's fashion with feminine cuts, silhouettes, and styling."
            elif g in ("male", "man", "boy"):
                gender_rule = " The model is MALE — generate exclusively men's fashion with masculine cuts and tailoring."

        return (
            f"Full-body fashion editorial photo of {subject_str} wearing: {recommendation}. "
            f"MANDATORY: Show the COMPLETE HEAD-TO-TOE outfit including face, torso, legs, and feet — NO cropping. "
            f"Aesthetic: {aesthetic}. Scene: {venue}."
            f"{gender_rule} "
            "STYLE DIRECTIVE: Focus on commercially available silhouettes, standard retail fashion cuts, and recognizable clothing items. "
            "Use realistic high-street and luxury retail textures like cotton, silk, denim, wool, and leather. "
            "Ultra-detailed, cinematic lighting, glossy runway-quality textures, realistic fabric details, and vibrant color contrast. "
            "Use professional full-length studio photography style with natural human proportions. "
            "No cartoon, no text overlays, no artifacts, no cropping at knees or ankles."
        )

    @staticmethod
    def create_inpainting_prompt(recommendation: str, aesthetic: str, venue: str, gender: str = None, size: str = None) -> str:
        """Creates an inpainting prompt that preserves the subject while replacing attire.
        Always generates full-body images."""
        gender_rule = ""
        if gender:
            g = gender.strip().lower()
            if g in ("female", "woman", "girl"):
                gender_rule = " STRICT: Generate ONLY women's fashion — dresses, skirts, feminine tops, feminine accessories. DO NOT generate men's clothing."
            elif g in ("male", "man", "boy"):
                gender_rule = " STRICT: Generate ONLY men's fashion — suits, trousers, shirts, masculine tailoring. DO NOT generate women's clothing."

        return (
            "Generate a photorealistic FULL-BODY fashion edit on the provided reference photo. "
            "MANDATORY: The output must show the complete body from head to toe — face, torso, legs, and feet fully visible. DO NOT crop or cut off any body part. "
            "VERY IMPORTANT: keep the person's face, eyes, nose, mouth, and hairline unchanged and exactly the same as the original image. "
            "Do not alter facial identity, expression, or skin details. "
            f"Keep the original person's pose, body shape, skin tone, and silhouette exactly the same. "
            f"Replace only the clothing and accessories with {recommendation} for a {aesthetic} look at {venue}. "
            f"{gender_rule} "
            f"STRICT INSTRUCTION: The size must appear as {size or 'standard'}. "
            "Add elegant styling details, polished couture finishing, and crisp high-resolution textures. "
            "The output must look like a real full-length fashion editorial photo, preserving identity and facial features."
        )

    @staticmethod
    def get_standard_negative() -> str:
        """Standard fashion negative prompt."""
        return (
            "cartoon, illustration, drawing, 3d render, anime, low quality, "
            "deformed body, extra limbs, blurry face, distorted features, "
            "cluttered background, bad lighting, watermark, text, mutated hands, "
            "cropped image, cut off legs, cut off feet, partial body, headshot only, portrait only."
        )

    @staticmethod
    def refine_outfit_description(vibe_analysis: str, user_request: str) -> str:
        """Refines a raw user request or vibe analysis into a clean outfit description."""
        return f"{user_request}. Inspired by: {vibe_analysis}. Focus on flattering silhouette, premium textures, and polished styling."
