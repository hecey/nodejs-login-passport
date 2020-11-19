const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: String,
    password: String
});

userSchema.methods.encryptPassport = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassport = function (password) {
    return bcrypt.compareSync(password, this.password)
};
module.exports=mongoose.model('users',userSchema);