from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    aws_region: str = "us-east-1"
    opensearch_index: str = "fashion_products"
    supabase_url: str = ""
    supabase_service_key: str = ""
    s3_bucket_name: str = "aurastylist-images"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
