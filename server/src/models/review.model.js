import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vendor",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      default: "",
      maxlength: 500,
    },
  },
  { timestamps: true }
);

// One review per user per vendor
reviewSchema.index({ vendor: 1, user: 1 }, { unique: true });

export default mongoose.model("review", reviewSchema);
