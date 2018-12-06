const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken'); 

const secret = require('../shared/configs/config').secret;

var UserSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: String,
    name: {
        firstName: String,
        lastName: String
    },
    calendars:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Calendar'
        }
    ],
    cookbook: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
        }
    ]
});

UserSchema.pre( 'save', function(next, done){
    var user = this;

    mongoose.models["User"].findOne({email : user.email},function(err, results) {
        if(err) {
            done(err);
        } else if(results) { //there was a result found, so the email address exists
            user.invalidate("email","Email must be unique");
            done(new Error("Email must be unique"));
        } else {
            if( !user.isModified('password')) return next();

            user.password = bcrypt.hashSync(user.password, 10);
            next();
        }
    });
});

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

UserSchema.methods.generateJWT = function() {
    var today = new Date();
    var exp = new Date(today);
    exp.setTime(today.getTime() + 1000* 60* 60); //1 hour cookie

    var token = jwt.sign({
    id: this._id,
    email: this.email,
    exp: parseInt(exp.getTime() / 1000),
    }, secret);

    var wholeCookie = "access_token="+token+';path=/;expires='+ exp.toGMTString() +';HttpOnly;'
    return wholeCookie;
};

UserSchema.methods.toAuthJSON = function() {
    return {
        email: this.email,
        token: this.generateJWT(),
    };
};

var User = mongoose.model('User', UserSchema);

module.exports = User;
