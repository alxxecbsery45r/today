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
