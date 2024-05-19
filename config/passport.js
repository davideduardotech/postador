const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/userModel');
const passport = require('passport');

const {
  newAccountFb
} = require('../controllers/accountsCtrl')

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: (process.env.MODE == "DEV") ? process.env.FACEBOOK_REDIRECT_URI_DEV : process.env.FACEBOOK_REDIRECT_URI_DEV,
  profileFields: ['id', 'name', 'email', 'picture.width(500).height(500)'],
  passReqToCallback: true,
  scope: ['pages_messaging', 'pages_messaging_postbacks'] // Adicione as permissões necessárias aqui
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    console.log('id da conta do facebook:',profile.id);
    console.log('accessToken da conta do facebook:',accessToken)
    console.log('informações de perfil:', profile);
    console.log('refreshToken:', refreshToken);
    await newAccountFb(req.user, accessToken, profile);
    done(null, req.user);
  } catch (error) {
    done(error, null);
  }
}));
