import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
  {
    amount: Number,
    type: { type: String, enum: ["income", "expense"] },
    category: String,
    date: { type: Date, default: Date.now },
    note: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Record", recordSchema);