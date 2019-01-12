'use strict';

const passport = require('koa-passport');
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GoogleOauthJWTStrategy = require('passport-google-oauth-jwt').GoogleOauthJWTStrategy;

const session = require('koa-session');
const Router = require('koa-router');

const GOOGLE_CLIENT_ID =  process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

console.log(`GOOGLE_CLIENT_ID: '${GOOGLE_CLIENT_ID}'`);
console.log(`GOOGLE_CLIENT_SECRET: '${GOOGLE_CLIENT_SECRET}'`);

// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(obj, done) {
//   done(null, obj);
// });

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       callbackURL: '/auth/google/callback' // google api console에 등록되어 있어야 한다.
//     },
//     function(accessToken, refreshToken, profile, done) {
//       console.log('accessToken:', accessToken);
//       console.log('refreshToken:', refreshToken);

//       // asynchronous verification, for effect...
//       process.nextTick(function() {
//         // To keep the example simple, the user's Google profile is returned to
//         // represent the logged-in user.  In a typical application, you would want
//         // to associate the Google account with a user record in your database,
//         // and return that user instead.
//         return done(null, profile);
//       });
//     }
//   )
// );

passport.use(new GoogleOauthJWTStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
}, async (accesstoken, loginInfo, refreshToken, done) => {
  console.log('>>> google oauth strategy')
  done(null, {
    email: loginInfo.email
  });
}));

const setup = function(app) {
  // app.use(session({ secret: 'hello world' }));
  app.use(session(app));
  app.use(passport.initialize());
  app.use(passport.session());

  const router = new Router();

  router.get('/auth/google', async (ctx, next) => {
    console.log('>>> /auth/google');
    passport.authenticate('google-oauth-jwt', {
      callbackUrl: `http://localhost:4000/auth/google/callback`,
      scope: 'email'
    })(ctx, next);
  });
  
  router.get('/auth/google/callback', async (ctx, next) => {
    console.log('>>> /auth/google/callback');
    passport.authenticate('google-oauth-jwt', {
      callbackUrl: `http://localhost:3000/auth/google/callback`
    })(ctx, next);
  
    ctx.redirect('/');
  });

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  app.use(router.routes());
};

exports.setup = setup;