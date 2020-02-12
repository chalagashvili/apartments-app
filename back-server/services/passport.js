/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
import _ from 'lodash';
import moment from 'moment';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import refresh from 'passport-oauth2-refresh';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

const UserSchema = require('../models').userSchema;

const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  UserSchema.findOne({ email }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }
    return user.comparePassword(password, (cmpErr, isMatch) => {
      if (cmpErr) {
        return done(cmpErr);
      }
      if (!isMatch) {
        return done(null, false);
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
    return done(null, false);
  });
});

passport.use(jwtLogin);
passport.use(localLogin);

/* oAuth Logins */

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: `${process.env.BASE_URL}/auth/facebook/callback`,
  profileFields: ['name', 'email'],
  passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, done) => {
  if (req.user) {
    UserSchema.findOne({ facebook: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        return done(err);
      }
      return UserSchema.findById(req.user.id, (err, user) => {
        if (err) { return done(err); }
        user.facebook = profile.id;
        user.tokens.push({ kind: 'facebook', accessToken });
        user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
        user.profile.picture = user.profile.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`;
        return user.save((err) => {
          req.flash('info', { msg: 'Facebook account has been linked.' });
          done(err, user);
        });
      });
    });
  } else {
    UserSchema.findOne({ facebook: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        return done(null, existingUser);
      }
      return UserSchema.findOne({ email: profile._json.email }, (err, existingEmailUser) => {
        if (err) { return done(err); }
        if (existingEmailUser) {
          req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.' });
          return done(err);
        }
        const user = new UserSchema();
        user.email = profile._json.email;
        user.facebook = profile.id;
        user.tokens.push({ kind: 'facebook', accessToken });
        user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
        user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
        return user.save((err) => {
          done(err, user);
        });
      });
    });
  }
}));

/**
 * Sign in with GitHub.
 */
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_ID,
  clientSecret: process.env.GITHUB_SECRET,
  callbackURL: `${process.env.BASE_URL}/auth/github/callback`,
  passReqToCallback: true,
  scope: ['user:email'],
}, (req, accessToken, refreshToken, profile, done) => {
  if (req.user) {
    UserSchema.findOne({ github: profile.id }, (err, existingUser) => {
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a GitHub account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done(err);
      } else {
        UserSchema.findById(req.user.id, (err, user) => {
          if (err) { return done(err); }
          user.github = profile.id;
          user.tokens.push({ kind: 'github', accessToken });
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.picture = user.profile.picture || profile._json.avatar_url;
          return user.save((err) => {
            req.flash('info', { msg: 'GitHub account has been linked.' });
            done(err, user);
          });
        });
      }
    });
  } else {
    UserSchema.findOne({ github: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        return done(null, existingUser);
      }
      return UserSchema.findOne({ email: profile._json.email }, (err, existingEmailUser) => {
        if (err) { return done(err); }
        if (existingEmailUser) {
          req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with GitHub manually from Account Settings.' });
          return done(err);
        }
        const user = new UserSchema();
        user.email = _.get(_.orderBy(profile.emails, ['primary', 'verified'], ['desc', 'desc']), [0, 'value'], null);
        user.github = profile.id;
        user.tokens.push({ kind: 'github', accessToken });
        user.profile.name = profile.displayName;
        user.profile.picture = profile._json.avatar_url;
        return user.save((err) => {
          done(err, user);
        });
      });
    });
  }
}));

/**
 * Sign in with Google.
 */
const googleStrategyConfig = new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: '/auth/google/callback',
  passReqToCallback: true,
}, (req, accessToken, refreshToken, params, profile, done) => {
  if (req.user) {
    UserSchema.findOne({ google: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser && (existingUser.id !== req.user.id)) {
        req.flash('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        return done(err);
      }
      return UserSchema.findById(req.user.id, (err, user) => {
        if (err) { return done(err); }
        user.google = profile.id;
        user.tokens.push({
          kind: 'google',
          accessToken,
          accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
          refreshToken,
        });
        user.profile.name = user.profile.name || profile.displayName;
        user.profile.gender = user.profile.gender || profile._json.gender;
        user.profile.picture = user.profile.picture || profile._json.picture;
        return user.save((err) => {
          req.flash('info', { msg: 'Google account has been linked.' });
          done(err, user);
        });
      });
    });
  } else {
    UserSchema.findOne({ google: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        return done(null, existingUser);
      }
      return UserSchema.findOne({ email: profile.emails[0].value }, (err, existingEmailUser) => {
        if (err) { return done(err); }
        if (existingEmailUser) {
          req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.' });
          return done(err);
        }
        const user = new UserSchema();
        user.email = profile.emails[0].value;
        user.google = profile.id;
        user.tokens.push({
          kind: 'google',
          accessToken,
          accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
          refreshToken,
        });
        user.profile.name = profile.displayName;
        user.profile.picture = profile._json.picture;
        return user.save((err) => {
          done(err, user);
        });
      });
    });
  }
});
passport.use('google', googleStrategyConfig);
refresh.use('google', googleStrategyConfig);
