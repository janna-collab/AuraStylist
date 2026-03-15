import boto3
from .config import settings

def get_bedrock_client():
    return boto3.client(
        service_name='bedrock-runtime',
        region_name=settings.aws_region,
        aws_access_key_id=settings.aws_access_key_id,
        aws_secret_access_key=settings.aws_secret_access_key
    )
