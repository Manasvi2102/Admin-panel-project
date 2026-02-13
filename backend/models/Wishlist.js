import mongoose from 'mongoose';

const wishlistSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    books: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    }],
  },
  {
    timestamps: true,
  }
);

export const Wishlist = mongoose.model('Wishlist', wishlistSchema);

