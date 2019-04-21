const mongoose = require('mongoose');
const valiator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

UserSchema.methods.removeToken = function(token) {
    let user = this;
    return user.updateOne({
        $pull : {
            tokens : {token}
        }
    });
}

UserSchema.statics.findByToken = function(token) {
    let User = this;
    let decoded;
    try {
        decoded = jwt.verify(token,'abc123');
    } catch(e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}

UserSchema.statics.findByCredentials = function(email, password) {
    let User = this;
    return User.findOne({email}).then(user => {
        if(!user) {
            return Promise.reject('User not found');
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(res) {
                    resolve(user);
                } else {
                    reject('Password mismatch');
                }
            })
        })
        
    });
}

UserSchema.pre('save', function (next) {
    const user = this;
    if(user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        });
    } else {
        next();
    }
});

const User = mongoose.model('User',UserSchema);

module.exports = {User};