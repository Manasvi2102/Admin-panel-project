import mongoose from 'mongoose';

const authorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    nationality: {
      type: String,
      trim: true,
    },
    birthDate: {
      type: Date,
    },
    image: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Author = mongoose.model('Author', authorSchema);

