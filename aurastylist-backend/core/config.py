from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    aws_region: str = "us-east-1"
    supabase_url: str = ""
    supabase_service_key: str = ""
    s3_bucket_name: str = "aurastylist-images"

    class Config:
        env_file = ".env"

settings = Settings()
