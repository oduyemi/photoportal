import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  department: string;
  jobRole: string;
  birthday: Date;
  images: string[];
  lastLogin?: Date;
  emailVerified: boolean;
  profileCompleted: boolean;
  verificationCode?: string;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: [true, "First name is required"] },
    lastName: { type: String, required: [true, "Last name is required"] },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: (v: string) => /^[^\s@]+@linkorgnet\.com$/.test(v),
        message: "Only work emails ending with @linkorgnet.com are allowed",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    department: { type: String },
    jobRole: { type: String },
    birthday: { type: Date },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (v: string[]) => v.length <= 2,
        message: "You can only upload up to 2 images",
      },
    },
    lastLogin: { type: Date },
    emailVerified: { type: Boolean, default: false },
    profileCompleted: { type: Boolean, default: false },
    verificationCode: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_: unknown, ret: any) {
        delete ret.password;
        delete ret.__v;
        delete ret.verificationCode;
        return ret;
      },
    },
  }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;
