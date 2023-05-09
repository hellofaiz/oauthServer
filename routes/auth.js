const express = require('express');
const router = express.Router();
const passport = require("passport");
const { generateJWT } = require('../middlewares/generateJWT');
// const path = require('path');
// router.use(express.static(path.join(__dirname, 'build')));
const jwt = require("jsonwebtoken");


// router.get("/login/success", (req, res) => {
// console.log(req.user);
// if (req.user) {
// 	const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET_DEV, { expiresIn: '1h' });
// 	res.status(200).json({
// 		error: false,
// 		message: "Successfully Loged In",
// 		user: req.user,
// 		token: token,
// 	});
// } else {
// 	res.status(403).json({ error: true, message: "Not Authorized" });
// }
// });
// =============================================================================
// Sign Token
// =============================================================================
var jwt = require('jsonwebtoken');

router.post('/login/success', passport.authenticate('local'), (req, res) => {
	jwt.sign({ user: req.user }, 'StRoNGs3crE7', (err, token) => {
		if (err) return res.json(err);

		// Send Set-Cookie header
		res.cookie('jwt', token, {
			httpOnly: false,
			sameSite: 'none',
			signed: true,
			secure: true
		});

		// Return json web token
		return res.json({
			jwt: token
		});
	});
});
// =============================================================================
// Login route with any Passport authentication strategy
// =============================================================================
// Passport provides us the authenticated user in the request
router.post('/login', passport.authenticate('local', {
	session: false
}), (req, res) => {
	// Create and sign json web token with the user as payload
	jwt.sign({
		user: req.user
	}, config.jwt.secret, config.jwt.options, (err, token) => {
		if (err) return res.status(500).json(err);

		// Send the Set-Cookie header with the jwt to the client
		res.cookie('jwt', token, config.jwt.cookie);

		// Response json with the jwt
		return res.json({
			jwt: token
		});
	});
});
router.get("/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});
router.get("/google", passport.authenticate("google", ["openid", "profile", "email"]));
// const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

router.get(
	'/google/callback',
	passport.authenticate('google', {
		successRedirect: `${process.env.CLIENT_URL}`,
		failureRedirect: '/login/failed',
		// session: false,
	}),
	// (req, res) => {
	// 	const token = generateJWT(req.user);
	// 	console.log('token', token);
	// 	res.cookie('token', token, { maxAge: 900000, httpOnly: true, secure: false, sameSite: 'none', domain: "https://quizzical-dltk.onrender.com", path: '/' });
	// 	res.redirect("https://quizzical-dltk.onrender.com");
	// },
);


router.get('/logout', function (req, res) {
	req.logout((err) => {
		if (err) {
			console.log(err);
		} else {
			req.session.destroy();
			res.redirect(`${process.env.CLIENT_URL}`);
		}
	});
});
module.exports = router;