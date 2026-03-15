import boto3
import json
import logging
import time
from typing import Optional, List, Any, Dict
from botocore.config import Config
from tenacity import retry, wait_exponential, stop_after_attempt, retry_if_exception_type
from .config import REGION

logger = logging.getLogger(__name__)

def is_transient_error(e):
    """Check if the error is a transient Bedrock error that deserves a retry."""
    err_str = str(e)
    return any(x in err_str for x in ["ThrottlingException", "ServiceUnavailableException", "InternalServerError"])

class BedrockClient:
    def __init__(self, region=REGION):
        # Configure standard retries for transient errors
        config = Config(
            region_name=region,
            retries={"mode": "standard", "max_attempts": 5}
        )
        self.session = boto3.Session(region_name=region)
        self.client = self.session.client(service_name='bedrock-runtime', config=config)

    @retry(
        wait=wait_exponential(multiplier=1, min=2, max=10),
        stop=stop_after_attempt(5),
        retry=retry_if_exception_type(Exception), # We'll refine inside the method or via predicate
        retry_error_callback=lambda retry_state: retry_state.outcome.result(),
        before_sleep=lambda retry_state: logger.warning(f"Transient error detected. Retrying in {retry_state.next_action.sleep} seconds...")
    )
    def invoke_model(self, model_id: str, body: dict):
        """Invoke a model with a JSON body."""
        try:
            response = self.client.invoke_model(
                modelId=model_id,
                body=json.dumps(body)
            )
            return json.loads(response.get("body").read())
        except Exception as e:
            if not is_transient_error(e):
                # Don't retry ValidationException or other non-transient errors
                if "ValidationException" in str(e):
                    logger.info(f"Model validation issue (likely mask-related): {e}")
                else:
                    logger.error(f"CRITICAL: Non-retryable error invoking Bedrock model {model_id}. Error: {e}")
                return {"error": str(e)}
            raise # Let tenacity handle retries for transient errors

    @retry(
        wait=wait_exponential(multiplier=1, min=2, max=10),
        stop=stop_after_attempt(5),
        retry=retry_if_exception_type(Exception),
        retry_error_callback=lambda retry_state: retry_state.outcome.result(),
        before_sleep=lambda retry_state: logger.warning(f"Retrying converse after transient error...")
    )
    def converse(self, model_id: str, messages: list, system_prompts: Optional[list] = None):
        """Wrapper for the Bedrock Converse API."""
        try:
            kwargs = {
                "modelId": model_id,
                "messages": messages,
            }
            if system_prompts:
                kwargs["system"] = [{"text": p} for p in system_prompts]

            response = self.client.converse(**kwargs)
            return response
        except Exception as e:
            if not is_transient_error(e):
                logger.error(f"Non-retryable error in converse: {e}")
                return None
            raise

# Singleton instance
bedrock_client = BedrockClient()
