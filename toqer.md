# AJKMart System Deep Scan Report
**Generated:** Sun Apr 19 11:13:28 UTC 2026
**Root:** /workspaces/today

## 1. Project Overview
- Monorepo with pnpm workspaces
- Database: Neon PostgreSQL via Drizzle ORM
- API Server: Node.js + Express + TypeScript (po<!--  -->rt 4000)

**Applications found:**
  - admin (Vite (React))
  - ajkmart (Expo (React Native))
  - api-server (unknown)
  - rider-app (Vite (React))
  - vendor-app (Vite (React))

## 2. Backend API Endpoints (implemented)
| Method | Endpoint |
|--------|----------|
| get | /api/health |
| post | /api/auth/register |
| post | /api/auth/login |
| get | /api/user/profile |

## 3. Frontend API Calls (what apps request)
### ajkmart
| Method | Endpoint |
|--------|----------|

### vendor-app
| Method | Endpoint |
|--------|----------|

### rider-app
| Method | Endpoint |
|--------|----------|

## 4. Database Schema (tables)
- `account_conditions`
- `account_deletion_requests`
- `admin_accounts`
- `auth_audit_log`
- `banners`
- `bulk_upload_logs`
- `categories`
- `delivery_whitelist`
- `flash_deals`
- `gps_spoof_alerts`
- `index`
- `kyc_verifications`
- `live_locations`
- `location_hierarchy`
- `location_history`
- `location_logs`
- `login_history`
- `magic_link_tokens`
- `map_api_usage_log`
- `notifications`
- `order_items`
- `orders`
- `parcel_bookings`
- `pending_otps`
- `pharmacy_orders`
- `platform_settings`
- `popular_locations`
- `product_variants`
- `products`
- `promo_codes`
- `push_subscriptions`
- `rate_limits`
- `refresh_tokens`
- `reviews`
- `ride_bids`
- `ride_event_logs`
- `ride_messages`
- `ride_notified_riders`
- `ride_ratings`
- `ride_service_types`
- `rider_penalties`
- `rider_profiles`
- `rides`
- `saved_addresses`
- `school_routes`
- `service_zones`
- `support_tickets`
- `supported_payment_methods`
- `system_snapshots`
- `user_interactions`
- `user_sessions`
- `user_settings`
- `users`
- `van_service`
- `vendor_profiles`
- `wallet_transactions`
- `wishlist`

## 5. Security & Risks
- **.env files found:** 5
- **CORS:** Not configured
- **Authentication:** ❌ Missing – endpoints are public
- **Rate limiting:** ❌ Missing

## 6. Missing Critical Features
- ❌ Real-time ride tracking (Socket.io)
- ❌ Payment gateway integration
- ❌ Push notifications
- ❌ File uploads (S3/Cloudinary)
- ❌ Admin dashboard
- ❌ 2FA enforcement
- ❌ Email/SMS fallback for OTP
- ❌ Analytics & reporting

## 7. Recommendations
**Immediate (P0)**
1. Add authentication endpoints (OTP + JWT) using @workspace/auth-utils
2. Implement role-based middleware
3. Restrict CORS in production

**Short-term (P1)**
1. Integrate Socket.io for real-time tracking
2. Add rate limiting
3. Set up logging and error tracking (Sentry)

**Long-term (P2)**
1. Generate type-safe API client with OpenAPI (Orval)
2. Add integration tests
3. Deploy with HTTPS

## 8. Quick Fix Commands
\`\`\`bash
cd /workspaces/today/api-server
pnpm add jsonwebtoken @types/jsonwebtoken express-rate-limit
\`\`\`

