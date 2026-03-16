
import io
from PIL import Image
from services.nova.vision import resize_image_if_needed
from core import database
import uuid

def test_image_resize():
    print("Testing image resize and format detection...")
    # Create a 2000x2000 RGBA PNG (larger than MAX_IMAGE_PIXELS usually)
    img = Image.new('RGBA', (2000, 2000), color=(255, 0, 0, 255))
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    png_bytes = buf.getvalue()
    
    # Resize should convert to JPEG and return "jpeg" format
    resized_bytes, format_str = resize_image_if_needed(png_bytes, "png")
    print(f"Original: PNG, 2000x2000. Resized format: {format_str}")
    
    img_resized = Image.open(io.BytesIO(resized_bytes))
    print(f"Resized dimensions: {img_resized.size}, Mode: {img_resized.mode}")
    
    assert format_str == "jpeg"
    assert img_resized.mode == "RGB"
    assert img_resized.width % 16 == 0
    assert img_resized.height % 16 == 0
    print("Image resize test PASSED!")

def test_database_custom_id():
    print("\nTesting database custom ID support...")
    request_id = f"req_{uuid.uuid4().hex[:8]}"
    test_data = {"test": "data", "request_id": request_id}
    
    # Save with custom ID
    saved_id = database.save_style_request("user_test", test_data)
    print(f"Saved style request with ID: {saved_id}")
    
    # Fetch with custom ID string
    doc = database.get_style_request(request_id)
    if doc:
        print(f"Successfully fetched doc with custom ID: {doc['_id']}")
        assert doc['_id'] == request_id
    else:
        print("Failed to fetch doc with custom ID")
        exit(1)
        
    print("Database custom ID test PASSED!")

if __name__ == "__main__":
    try:
        test_image_resize()
        test_database_custom_id()
        print("\nAll local verification tests PASSED!")
    except Exception as e:
        print(f"\nVerification FAILED: {e}")
        import traceback
        traceback.print_exc()
