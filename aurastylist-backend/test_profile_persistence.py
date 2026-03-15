import requests
import sys

BASE_URL = "http://127.0.0.1:8000/api/profile"
TEST_USER = "test_user@example.com"

def test_profile_persistence():
    print(f"Testing profile persistence for user: {TEST_USER}")
    
    # 1. Generate a profile
    print("\n1. Generating profile...")
    data = {
        "height": "180cm",
        "shoeSize": "10",
        "preferredFit": "Slim",
        "userId": TEST_USER,
        "name": "Jane Doe"
    }
    try:
        response = requests.post(f"{BASE_URL}/generate", data=data)
        if response.status_code == 200:
            print("Successfully generated profile.")
            print("Report:", response.json())
        else:
            print(f"Failed to generate profile. Status: {response.status_code}")
            print("Response:", response.text)
            return False
    except Exception as e:
        print(f"Error connecting to backend: {e}")
        return False

    # 2. Retrieve the profile
    print("\n2. Retrieving profile...")
    try:
        response = requests.get(f"{BASE_URL}/{TEST_USER}")
        if response.status_code == 200:
            print("Successfully retrieved profile.")
            profile = response.json()
            print("Profile:", profile)
            if profile.get("inputs", {}).get("name") == "Jane Doe":
                print("Name correctly persisted in inputs!")
                return True
            else:
                print("Name NOT found or incorrect in persisted profile.")
                return False
        else:
            print(f"Failed to retrieve profile. Status: {response.status_code}")
            print("Response:", response.text)
            return False
    except Exception as e:
        print(f"Error connecting to backend: {e}")
        return False

if __name__ == "__main__":
    success = test_profile_persistence()
    if success:
        print("\nVerification successful!")
        sys.exit(0)
    else:
        print("\nVerification failed.")
        sys.exit(1)
