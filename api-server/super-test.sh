#!/bin/bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNDRiNjczMi05ZjQzLTRlMjYtYTFhMC1hYWUzMzExZWM2YTAiLCJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE3NzY2MTM0MTEsImV4cCI6MTc3NjYxNDMxMX0.Dqp0h7VrcoWVQlatK3JWHfdP9r45ZB7USP7LzUrx_l4"
URL="http://localhost:4000/api"

echo "🚀 Starting System Tests with New Admin Token..."

# 1. Test Rider Registration
echo "📦 Testing Rider Registration..."
curl -s -X POST $URL/rider/register   -H "Authorization: Bearer $TOKEN"   -H "Content-Type: application/json"   -d '{"vehicleType": "Bike", "licenseNumber": "KHI-1234"}' | jq .

# 2. Test GPS Live Tracking
echo -e "\n📍 Testing Live GPS Tracking Update..."
curl -s -X POST $URL/advanced/logistics/track   -H "Authorization: Bearer $TOKEN"   -H "Content-Type: application/json"   -d '{"lat": "24.8607", "lng": "67.0011"}' | jq .

# 3. Test Wallet Transfer
echo -e "\n💸 Testing Wallet Transfer (to Receiver)..."
curl -s -X POST $URL/advanced/wallet/transfer   -H "Authorization: Bearer $TOKEN"   -H "Content-Type: application/json"   -d '{"receiverPhone": "03112233445", "amount": 100}' | jq .

echo -e "\n✅ Final Tests Complete!"
