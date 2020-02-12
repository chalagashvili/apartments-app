import path from 'path';
import multer from 'multer';
import passport from 'passport';
import controllers from '../controllers';
import '../services/passport';
import { successResponse } from '../services/apiResponse';

const authControl = controllers.authController;
const assetControl = controllers.assetController;
const upload = multer({ dest: path.join(__dirname, 'uploads') });
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = (app) => {
  app.post('/signIn', requireSignin, authControl.signIn);
  app.post('/signUp', authControl.signUp);
  app.post('/addAsset', requireAuth, assetControl.addAsset);
  app.delete('/removeAsset', requireAuth, assetControl.removeAsset);
  app.put('/editAsset', requireAuth, assetControl.editAsset);
  app.get('/getAssets/:page?', requireAuth, assetControl.getAssets);
  app.post('/upload', upload.single('image'), (_, res) => successResponse(res, 'File uploaded successfully'));
  app.get('/account/verify', requireAuth, authControl.getVerifyEmail);
  app.get('/account/verify/:token', requireAuth, authControl.getVerifyEmailToken);
  app.get('/account', requireAuth, authControl.getAccount);
  app.post('/account/profile', requireAuth, authControl.postUpdateProfile);
  app.post('/account/password', requireAuth, authControl.postUpdatePassword);
  app.delete('/account/delete', requireAuth, authControl.postDeleteAccount);
  app.get('/account/unlink/:provider', requireAuth, authControl.getOauthUnlink);
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => res.redirect(req.session.returnTo || '/'));
  app.get('/auth/github', passport.authenticate('github'));
  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => res.redirect(req.session.returnTo || '/'));
  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets.readonly'], accessType: 'offline', prompt: 'consent' }));
  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => res.redirect(req.session.returnTo || '/'));
};
