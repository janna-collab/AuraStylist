import asyncio
from routers import gallery

async def main():
    await gallery.generate_images_background('testid123')
    print(gallery.generation_jobs.get('testid123'))

asyncio.run(main())
