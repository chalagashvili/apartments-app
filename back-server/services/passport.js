const passport = require('passport');
const LocalStrategy = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const UserSchema = require('../models').userSchema;

const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, async (email, password, done) => {
  try {
    const user = await UserSchema.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'Email is incorrect.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return done(null, false, { message: 'Email or password is incorrect.' });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.SECRET,
};

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await UserSchema.findById(payload.sub);
    if (user) {
      return done(null, user);
    }
    return done(null, false, { message: 'Auth token is invalid' });
  } catch (error) {
    return done(error, false);
  }
});

passport.use(jwtLogin);
passport.use(localLogin);
