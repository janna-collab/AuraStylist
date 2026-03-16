from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()
from mangum import Mangum

from routers import analyze, style, gallery, shop, chat, profile, style_request

# redirect_slashes=False prevents FastAPI from doing a 307 redirect
# when a request hits /api/gallery instead of /api/gallery/
app = FastAPI(title="AuraStylist Backend", redirect_slashes=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/api/analyze", tags=["Analyze"])
app.include_router(style.router, prefix="/api/style", tags=["Style"])
app.include_router(gallery.router, prefix="/api/gallery", tags=["Gallery"])
app.include_router(shop.router, prefix="/api/shop", tags=["Shop"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(profile.router, prefix="/api/profile", tags=["Profile"])
app.include_router(style_request.router, prefix="/api/style/request", tags=["Style Request"])

@app.get("/")
def read_root():
    return {"message": "Welcome to AuraStylist API"}

handler = Mangum(app)
