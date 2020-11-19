const passport = require('passport');
const LocaStrategy =require('passport-local').Strategy;

const User = require('../models/user');

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

 passport.deserializeUser(async (id, done)=>{
    const user = await User.findById(id);
    done(null, user.id);
});

passport.use('local-signup', new LocaStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},async (req, email, password, done)=>{
    const exist = User.find({email:email});
    if(exist){
        return done(null, false, req.flash('signupMessage','The email is already taken.'))
    }else{
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassport(password);
        await newUser.save();
        done(null, newUser);
    }

    
}));