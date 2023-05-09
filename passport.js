const GoogleStrategy = require("passport-google-oauth2").Strategy;
const passport = require("passport");

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: "/auth/google/callback",
			scope: ["profile", "email"],
		},
		function (accessToken, refreshToken, profile, callback) {
			console.log("accessToken", accessToken, refreshToken, profile, "Anurag_Profilehjbhugbdshfnwe");

			callback(null, profile);
		}
	)
);
// Configure Strategy
// =============================================================================
var JwtCookieComboStrategy = require('passport-jwt-cookiecombo');

passport.use(new JwtCookieComboStrategy({
	secretOrPublicKey: 'StRoNGs3crE7'
}, (payload, done) => {
	return done(null, payload.user);
}));


// Sample Passport Authentication where the user is set for the jwt payload
// =============================================================================
passport.use(new LocalStrategy({
	// My users have only email
	usernameField: 'email',
	session: false
}, (username, password, done) => {
	User.findOne({
		email: username
	})
		// Explicitly select the password when the model hides it
		.select('password role').exec((err, user) => {
			if (err) return done(err);

			// Copy the user w/o the password into a new object
			if (user && user.verifyPassword(password)) return done(null, {
				id: user._id,
				role: user.role
			});

			return done(null, false);
		});
}));
var JwtCookieComboStrategy = require('passport-jwt-cookiecombo');

// Authenticate API calls with the Cookie Combo Strategy
passport.use(new JwtCookieComboStrategy({
	secretOrPublicKey: config.jwt.secret,
	jwtVerifyOptions: config.jwt.options,
	passReqToCallback: false
}, (payload, done) => {
	return done(null, payload.user, {});
}));

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});
