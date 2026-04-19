import { pgTable, integer, text, varchar, timestamp, decimal, boolean } from 'drizzle-orm/pg-core';

// 1. Users & Auth
export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  phone: varchar('phone', { length: 20 }),
  password: text('password').notNull(),
  passwordHash: text('password_hash'),
  role: varchar('role', { length: 50 }).default('customer').notNull(),
  walletBalance: decimal('wallet_balance', { precision: 10, scale: 2 }).default('0.00'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const refreshTokens = pgTable('refresh_tokens', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').references(() => users.id),
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

export const otps = pgTable('otps', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  phone: varchar('phone', { length: 20 }).notNull(),
  code: varchar('code', { length: 6 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

// 2. Commerce
export const categories = pgTable('categories', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  image: text('image'),
});

export const products = pgTable('products', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').default(0),
  categoryId: integer('category_id').references(() => categories.id),
  vendorId: integer('vendor_id').references(() => users.id),
  imageUrl: text('image_url'),
});

// 3. Orders & Logistics
export const orders = pgTable('orders', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').references(() => users.id),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }),
  status: varchar('status', { length: 50 }).default('pending'),
});

export const orderItems = pgTable('order_items', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer('order_id').references(() => orders.id),
  productId: integer('product_id').references(() => products.id),
  quantity: integer('quantity').notNull(),
});

export const rides = pgTable('rides', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer('order_id').references(() => orders.id),
  riderId: integer('rider_id').references(() => users.id),
  status: varchar('status', { length: 50 }).default('pending'),
  pickupLocation: text('pickup_location'),
  dropoffLocation: text('dropoff_location'),
});

export const rider_profiles = pgTable('rider_profiles', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').references(() => users.id),
  vehicleDetails: text('vehicle_details'),
  isOnline: boolean('is_online').default(false),
  currentLocation: text('current_location'),
});

export const ride_bids = pgTable('ride_bids', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  rideId: integer('ride_id'),
  riderId: integer('rider_id').references(() => rider_profiles.id),
  bidAmount: decimal('bid_amount', { precision: 10, scale: 2 }),
  status: varchar('status', { length: 20 }).default('pending'),
});

// 4. Social & Wallet
export const notifications = pgTable('notifications', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').references(() => users.id),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const transactions = pgTable('transactions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').references(() => users.id),
  type: varchar('type', { length: 20 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const reviews = pgTable('reviews', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  productId: integer('product_id').references(() => products.id),
  userId: integer('user_id').references(() => users.id),
  rating: integer('rating'),
  comment: text('comment'),
});
