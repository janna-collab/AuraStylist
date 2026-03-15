import boto3
import json
import os

def test_bedrock():
    region = "us-east-1"
    client = boto3.client("bedrock-runtime", region_name=region)
    
    # Try a simple Nova Lite call to verify access
    model_id = "amazon.nova-lite-v1:0"
    body = {
        "inferenceConfig": {
            "maxNewTokens": 10,
            "temperature": 0
        },
        "messages": [
            {
                "role": "user",
                "content": [{"text": "Hello"}]
            }
        ]
    }
    
    try:
        response = client.converse(
            modelId=model_id,
            messages=[{"role": "user", "content": [{"text": "Hello"}]}]
        )
        print(f"Success! Response from {model_id}")
    except Exception as e:
        print(f"Failed to call {model_id}: {e}")

if __name__ == "__main__":
    test_bedrock()
