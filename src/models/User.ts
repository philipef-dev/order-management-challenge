import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    email: string;
    password: string;
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
}, { timestamps: true })

UserSchema.pre<IUser>('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 8);
});

UserSchema.methods.comparePassword = function (password: string) {
    return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
