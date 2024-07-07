// models/Manga.js
import mongoose from "mongoose";

// Define the schema for manga entries
const mangaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    chaptersRead: {
        type: Number,
        default: 0
    },
    linkToRead: {
        type: String,
        default: function() {
            return `https://www.google.com/search?q=${encodeURIComponent(this.name + ' read online')}`
        }
    },
    user :[{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    
}, { timestamps: true });

// Create a Mongoose model based on the schema
const Manga = mongoose.model('Manga', mangaSchema);
export default Manga;
 