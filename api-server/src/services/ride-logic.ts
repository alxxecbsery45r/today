// @ts-nocheck
import { db } from "../db";
import { ride_bids, rides } from "../db/schema";
import { eq } from "drizzle-orm";

export const acceptBid = async (rideId: string, bidId: string) => {
  // 1. Bid status update karein
  // 2. Ride table mein driver_id assign karein
  // 3. Baqi saari bids reject karein
  console.log(`Accepting bid ${bidId} for ride ${rideId}`);
};
