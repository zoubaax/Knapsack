"""
Quick test script to verify CORS is working
Run this to test if the Flask server responds correctly to OPTIONS requests
"""
import requests

# Test OPTIONS request
url = 'http://127.0.0.1:5000/api/knapsack/solve'
headers = {
    'Origin': 'http://localhost:5173',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'Content-Type, Authorization'
}

try:
    response = requests.options(url, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Headers: {dict(response.headers)}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("\n✅ CORS is working correctly!")
    else:
        print(f"\n❌ CORS failed with status {response.status_code}")
except Exception as e:
    print(f"\n❌ Error: {e}")
    print("Make sure Flask server is running on http://127.0.0.1:5000")

