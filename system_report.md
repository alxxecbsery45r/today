# AJKMart System Deep Scan Report
**Generated:** Sun Apr 19 16:27:32 UTC 2026
**Root:** /workspaces/today

## 1. Project Overview
- Monorepo with pnpm workspaces
- **Applications found:**
  - api-server
  - scripts
  - package.json

## 2. Backend API Endpoints (Detected)
| Method | Endpoint |
|--------|----------|
| get | / |
| get | /:productId |
| get | /admin-dashboard |
| get | /my-orders |
| get | /profile |
| get | /stats |
| post | / |
| post | /categories |
| post | /checkout |
| post | /deposit |
| post | /kyc/submit |
| post | /login |
| post | /logistics/assign |
| post | /logistics/track |
| post | /products |
| post | /register |
| post | /request |
| post | /rides/bid |
| post | /signup |
| post | /verify |
| post | /wallet/transfer |
| put | /update |

## 3. Database Schema (Tables)
- `account_conditions`
- `account_deletion_requests`
- `admin_accounts`
- `audit_logs`
- `auth_audit_log`
- `banners`
- `bulk_upload_logs`
- `categories`
- `condition_rules`
- `condition_settings`
- `delivery_access_requests`
- `delivery_whitelist`
- `flash_deals`
- `gps_spoof_alerts`
- `idempotency_keys`
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
- `order_status_history`
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
- `school_subscriptions`
- `service_zones`
- `support_tickets`
- `supported_payment_methods`
- `system_audit_log`
- `system_snapshots`
- `user_interactions`
- `user_sessions`
- `user_settings`
- `users`
- `van_bookings`
- `van_routes`
- `van_schedules`
- `van_vehicles`
- `vendor_profiles`
- `wallet_transactions`
- `wishlist`
./api-server/src/db/schema.ts:import { pgTable, uuid, varchar, text, timestamp, jsonb, integer, decimal } from 'drizzle-orm/pg-core';
./artifacts/api-server/src/routes/orders.ts:import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
./artifacts/api-server/src/routes/wallet.ts:import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/account_conditions.ts:import { boolean, index, integer, jsonb, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/account_deletion_requests.ts:import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/admin_accounts.ts:import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/auth_audit_log.ts:import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/banners.ts:import { boolean, index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/bulk_upload_logs.ts:import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/categories.ts:import { boolean, index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/delivery_whitelist.ts:import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/flash_deals.ts:import { boolean, decimal, index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/gps_spoof_alerts.ts:import { boolean, decimal, index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/kyc_verifications.ts:import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/live_locations.ts:import { decimal, index, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/location_hierarchy.ts:import { boolean, index, integer, numeric, pgTable, serial, text, timestamp, type AnyPgColumn } from "drizzle-orm/pg-core";
./lib/db/src/schema/location_history.ts:import { index, jsonb, numeric, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/location_logs.ts:import { boolean, decimal, index, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/login_history.ts:import { boolean, pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
./lib/db/src/schema/magic_link_tokens.ts:import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/map_api_usage_log.ts:import { pgTable, text, integer, date, timestamp, serial, unique } from "drizzle-orm/pg-core";
./lib/db/src/schema/notifications.ts:import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/order_items.ts:import { decimal, index, integer, pgTable, text } from "drizzle-orm/pg-core";
./lib/db/src/schema/orders.ts:import { boolean, check, decimal, doublePrecision, index, json, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/parcel_bookings.ts:import { decimal, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/pending_otps.ts:import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/pharmacy_orders.ts:import { decimal, index, json, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/platform_settings.ts:import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/popular_locations.ts:import { boolean, decimal, index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/product_variants.ts:import { boolean, decimal, index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/products.ts:import { boolean, check, decimal, index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/promo_codes.ts:import { boolean, decimal, index, integer, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
./lib/db/src/schema/push_subscriptions.ts:import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/rate_limits.ts:import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/refresh_tokens.ts:import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/reviews.ts:import { boolean, index, integer, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
./lib/db/src/schema/ride_bids.ts:import { decimal, index, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
./lib/db/src/schema/ride_event_logs.ts:import { decimal, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/ride_messages.ts:import { index, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
./lib/db/src/schema/ride_notified_riders.ts:import { index, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
./lib/db/src/schema/ride_ratings.ts:import { boolean, index, integer, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
./lib/db/src/schema/ride_service_types.ts:import { boolean, decimal, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/rider_penalties.ts:import { decimal, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/rider_profiles.ts:import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/rides.ts:import { boolean, decimal, index, integer, pgTable, text, timestamp, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
./lib/db/src/schema/saved_addresses.ts:import { boolean, decimal, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/school_routes.ts:import { boolean, decimal, index, integer, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
./lib/db/src/schema/service_zones.ts:import { boolean, index, numeric, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/support_tickets.ts:import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/supported_payment_methods.ts:import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/system_snapshots.ts:import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/user_interactions.ts:import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/user_sessions.ts:import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
./lib/db/src/schema/user_settings.ts:import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/users.ts:import { boolean, check, decimal, index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/van_service.ts:import { boolean, decimal, index, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/vendor_profiles.ts:import { boolean, decimal, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/wallet_transactions.ts:import { check, decimal, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
./lib/db/src/schema/wishlist.ts:import { index, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
./node_modules/.ignored_drizzle-orm/pg-core/table.d.ts:     * @deprecated The third parameter of pgTable is changing and will only accept an array instead of an object
./node_modules/.ignored_drizzle-orm/pg-core/table.d.ts:export declare const pgTable: PgTableFn;
./node_modules/.ignored_drizzle-orm/pg-core/table.d.ts:export declare function pgTableCreator(customizeTableName: (name: string) => string): PgTableFn;
./node_modules/.pnpm/drizzle-orm@0.45.2_@types+pg@8.20.0_pg@8.20.0/node_modules/drizzle-orm/pg-core/table.d.ts:     * @deprecated The third parameter of pgTable is changing and will only accept an array instead of an object
./node_modules/.pnpm/drizzle-orm@0.45.2_@types+pg@8.20.0_pg@8.20.0/node_modules/drizzle-orm/pg-core/table.d.ts:export declare const pgTable: PgTableFn;
./node_modules/.pnpm/drizzle-orm@0.45.2_@types+pg@8.20.0_pg@8.20.0/node_modules/drizzle-orm/pg-core/table.d.ts:export declare function pgTableCreator(customizeTableName: (name: string) => string): PgTableFn;
./node_modules/.pnpm/drizzle-orm@0.45.2_pg@8.20.0/node_modules/drizzle-orm/pg-core/table.d.ts:     * @deprecated The third parameter of pgTable is changing and will only accept an array instead of an object
./node_modules/.pnpm/drizzle-orm@0.45.2_pg@8.20.0/node_modules/drizzle-orm/pg-core/table.d.ts:export declare const pgTable: PgTableFn;
./node_modules/.pnpm/drizzle-orm@0.45.2_pg@8.20.0/node_modules/drizzle-orm/pg-core/table.d.ts:export declare function pgTableCreator(customizeTableName: (name: string) => string): PgTableFn;

## 4. Security & Risks
- **.env files found:** 7
- **CORS:** Manual check required

## 5. Recommendations
1. Run `pnpm audit` to check for vulnerabilities.
2. Ensure all API routes have JWT middleware.
