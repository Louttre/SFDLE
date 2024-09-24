import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
const { isEmail } = validator;

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minLength: 3,
            maxLength: 20,
        },
        email: {
            type: String,
            required: true,
            validate: [isEmail],
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            maxLength: 1024,
            minLength: 6,
        },
        picture: {
            type: String,
            default: '',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        resetPasswordToken: String,
        resetPasswordTokenExpireAt: Date,
        verificationToken: String,
        verificationTokenExpireAt: Date,
    }, { timestamps: true }
);

// Pre-save hook to hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    try {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        return next(err);
    }
});

export const UserModel = mongoose.model('user', userSchema);
