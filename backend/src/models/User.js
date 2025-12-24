import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // Ya no es required porque OAuth no necesita password
    required: false,
  },
  // Nuevos campos para OAuth
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Permite nulls únicos
  },
  facebookId: {
    type: String,
    unique: true,
    sparse: true,
  },
  avatar: {
    type: String,
  },
  // ... resto de tus campos
}, {
  timestamps: true,
});

// Solo hashea password si existe
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);