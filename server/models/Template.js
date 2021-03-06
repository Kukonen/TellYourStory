const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const problemsSchema = new Schema({
    id: {
        type: String,
        required: false,
        unique: true
    },
    key: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: false,
        default: ""
    },
    images: {
        avatar: {
            type: String,
            required: false,
            default: null
        },
        background: {
            type: String,
            required: false,
            default: null
        }
    },
    story: {
        type: Array,
        required: false,
        default: []
    },
    chapter: {
        type: Array,
        required: false,
        default: []
    },
    counter: {
        type: Array,
        required: false,
        default: []
    }
});

module.exports = mongoose.model('template', problemsSchema);