const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");

const GOOGLE_CLIENT_ID =
  "386341289756-rlbald6e5e6vdtfb12nbp2gl0n3d1k0n.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

GITHUB_CLIENT_ID = "e8a603505075dc1a39eb";
GITHUB_CLIENT_SECRET = "d1fa923241e6c4800db21dffd8c07615ed7ce294";

FACEBOOK_APP_ID = "504774511065989";
FACEBOOK_APP_SECRET = "441af642a34fe0096800b4700a10080e";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.use(
  new GithubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "/api/v1/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "/api/v1/facebook/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
