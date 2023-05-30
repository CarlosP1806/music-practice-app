import { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
  username: string,
  password: string,
  email: string
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
});

const User = model<IUser>('User', UserSchema);
export default User;
