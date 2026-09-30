import mongoose from "mongoose";
import { CATEGORIES } from "../config/categories.js";

const habitSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, enum: CATEGORIES.map((c) => c.key) },
    amount: { type: Number, required: true, min: 0 },
    date: { type: String, required: true }, // YYYY-MM-DD
    note: { type: String, default: "", maxlength: 200 },
  },
  { timestamps: true }
);

export default mongoose.model("Habit", habitSchema);
