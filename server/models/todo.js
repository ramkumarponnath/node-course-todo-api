let mongoose = require('mongoose');

let Todo = mongoose.model('Todo',{
    text:{
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    completed:{
        type: Boolean,
        default: false
    },
    completedAt:{
        type: Number
    },
    _creator: {
        required: true,
        type: mongoose.Schema.Types.ObjectId
    }
});

module.exports = {
    Todo
};