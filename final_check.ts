import { checkSpoofing } from "./api-server/src/services/security-logic";

console.log("--- 🧪 AJKMart Logic Verification ---");

// Test 1: GPS Security Check
const lowSpeed = checkSpoofing(34.1, 73.1, 34.11, 73.11, 60);
const highSpeed = checkSpoofing(34.1, 73.1, 40.1, 80.1, 1); // 1 sec mein itna dur!

console.log("Normal Movement Test:", lowSpeed ? "❌ Failed" : "✅ Passed (Real)");
console.log("Fake GPS Test (Fast):", highSpeed ? "🚨 Alert (Fake Detected)" : "✅ Passed");

console.log("\n--- 🏁 Test Finished ---");
