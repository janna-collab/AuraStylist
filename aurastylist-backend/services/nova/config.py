import os
import logging

logger = logging.getLogger(__name__)

# Region configuration
REGION = os.getenv("AWS_REGION", "us-east-1")

# Nova Model IDs (v1)
NOVA_MICRO = "amazon.nova-micro-v1:0"
NOVA_LITE = "amazon.nova-lite-v1:0"
NOVA_PRO = "amazon.nova-pro-v1:0"
NOVA_CANVAS = "amazon.nova-canvas-v1:0"
NOVA_EMBEDDING = "amazon.nova-embed-image-v1:0"

# Nova Omni is generally mapped to the Pro model for multimodal reasoning in v1
NOVA_OMNI = "amazon.nova-pro-v1:0" 

# Support for legacy Titan
TITAN_IMAGE = "amazon.titan-image-generator-v2:0"

# Model Limits
MAX_SEED = 2147483646
MAX_IMAGE_PIXELS = 4194304
MIN_DIMENSION = 320
MAX_DIMENSION = 4096
