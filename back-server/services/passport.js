const passport = require('passport');
const LocalStrategy = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const UserSchema = require('../models').userSchema;

const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  UserSchema.findOne({ email }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: 'Email or password is incorrect.' });
    }
    return user.comparePassword(password, (cmpErr, isMatch) => {
      if (cmpErr) {
        return done(cmpErr);
      }
      if (!isMatch) {
        return done(null, false, { message: 'Email or password is incorrect.' });
      }
      return done(null, user);
    });
  });
});
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.SECRET,
};
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  UserSchema.findById(payload.sub, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    }
    return done(null, false, { message: 'Auth token is invalid' });
  });
});

passport.use(jwtLogin);
passport.use(localLogin);
