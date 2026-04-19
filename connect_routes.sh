#!/bin/bash

ROUTES_DIR="./api-server/src/routes"
mkdir -p $ROUTES_DIR

# Wallet Route update (Simplified for Testing)
cat << 'INNER_EOF' > $ROUTES_DIR/wallet.ts
import { processTransfer } from "../services/wallet-logic";

export const handleTransfer = async (req: any, res: any) => {
  const { senderId, receiverId, amount } = req.body;
  try {
    await processTransfer(senderId, receiverId, amount);
    res.status(200).json({ success: true, message: "Transfer Successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Transfer Failed" });
  }
};
INNER_EOF

echo "🔗 Routes connected to Services."
