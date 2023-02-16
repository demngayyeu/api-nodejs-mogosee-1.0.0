import mongoose from 'mongoose';
mongoose.set('strictQuery', true);

const Infos = mongoose.Schema({
    id: { type: String },
    verified: {
        type: Boolean,
        default: false
    },
    name: { type: String },
    firstName: { type: String },
    vanity: { type: String },
    birthday: { type: String },
    follow: { type: String },
    thumbSrc: { type: String },
    profileUrl: { type: String },
    gender: { type: String },
    hometown: { type: String },
    location: { type: String },
    relationship: { type: String },
    love: { type: String },
    website: { type: String },
    about: { type: String },
    quotes: { type: String },
}, { versionKey: false });
module.exports.Info = mongoose.model('info', Infos);