python -m venv venv
.\venv\Scripts\python.exe -m pip install fastapi mangum boto3 supabase python-dotenv pillow pydantic uvicorn
.\venv\Scripts\python.exe -m pip freeze > requirements.txt
