const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Mock user data (in production, this would be in a database)
// const users = [
//     {
//       id: '1',
//       name: 'Admin User',
//       email: 'admin@example.com',
//       password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
//       role: 'admin'
//     }
//   ];

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => uuidv4(),
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);