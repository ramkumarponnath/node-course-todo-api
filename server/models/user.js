const mongoose = require('mongoose');
const valiator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
    email : {
        type: String,
        minlength: 1,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: valiator.isEmail,
            message:'{VALUE} is not valid Email'
        }
    },
    password: {
        type: String,
        minlength:8,
        required:true,
    },
    tokens:[{
        access: {
            type: String,
            required:true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.generateAuthToken = function() {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id:user._id.toHexString(), access}, 'abc123').toString();
    user.tokens = user.tokens.concat([{access, token}]);
    return user.save().then(() => {
        return token;
    });
}

UserSchema.methods.toJSON = function() {
    let user = this;
    const userObject = user.toObject();
    return _.pick(userObject,['email','_id']);
}

const User = mongoose.model('User',UserSchema);

module.exports = {
    User
};