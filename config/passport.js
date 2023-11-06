const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model");

passport.serializeUser((user, done) => {
  // 將MongoDB的id，存到session
  // 並且將id簽名後，以Cookie的形式給使用者
  done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
  let foundUser = await User.findOne({ _id }).exec();
  // 將req.user這個屬性設定為foundUser
  done(null, foundUser);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("進入Google");
      console.log(profile);
      console.log("------------------------");
      let foundUser = await User.findOne({ googleID: profile.id }).exec();
      if (foundUser) {
        console.log("User 已經註冊過了");
        done(null, foundUser);
      } else {
        console.log("New User!");
        let newUser = new User({
          name: profile.displayName,
          googleID: profile.id,
          thumbnail: profile.photos[0].value,
          email: profile.emails[0].value,
        });
        let savedUser = await newUser.save();
        done(null, savedUser);
      }
    }
  )
);
