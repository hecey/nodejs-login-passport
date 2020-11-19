const { use } = require('passport');
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
    },
    async (req, email, password, done)=>{
        const user = await User.findOne({ email: email });
        if(user){
            return done(null, false, req.flash('signMessage','The email is already taken.'))
        }else{
            const newUser = new User();
            newUser.email = email;
            newUser.password = newUser.encryptPassport(password);
            await newUser.save();
            done(null, newUser);
        }
}));
passport.use('local-signin', new LocaStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
    },
    async (req, email, password, done) => {
        const user = await User.findOne({email:email});
        if(!user){
            return done(null, false, req.flash('signMessage','User not found.'))
        }
        
        if(!user.comparePassword(password)){
            return done(null, false, req.flash('signMessage','Incorrect password.'))
        }
        done(null,user);
}));