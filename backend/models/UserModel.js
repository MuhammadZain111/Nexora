import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, default: "" },
  },
  { timestamps: true },
);


// Hash password before saving
userSchema.pre("save", async function () {

  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare passwords on login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const UserModal = mongoose.model("User", userSchema);
export default UserModal;



export const searchUsersByNameOrEmail = async (
  query,
  currentUserId
) => {
  const users = await User.find({
    _id: { $ne: currentUserId },

    $or: [
      {
        name: {
          $regex: query,
          $options: "i",
        },
      },
      {
        email: {
          $regex: query,
          $options: "i",
        },
      },
    ],
  })
    .select("name email profilePic")
    .sort({ name: 1 })
    .limit(20);

  return users;
};
