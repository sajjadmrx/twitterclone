const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    content: { type: String, trim: true },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    pinned: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Post', UserSchema);