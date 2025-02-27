import {mongoose} from mongoose

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxlength: 50
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100
    },
    full_name: {
        type: String,
        maxlength: 100
    },
    image: {
        type: String
    },
    otp: {
        type: String,
        maxlength: 6
    },
    otp_expires_at: {
        type: Date
    },
    role: {
        type: String,
        default: 'user',
        maxlength: 20
    },
    approved: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
