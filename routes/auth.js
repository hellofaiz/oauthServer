const express = require('express');
const router = express.Router();
const passport = require("passport");
const { generateJWT } = require('../middlewares/generateJWT');
// const path = require('path');
// router.use(express.static(path.join(__dirname, 'build')));
const jwt = require("jsonwebtoken");


router.get("/api/user", (req, res) => {
	console.log("user", req.user );
	// console.log("isAuthenticated", req.isAuthenticated());

	if (req.user) {
		// const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET_DEV, { expiresIn: '1h' });
		res.status(200).json({
			error: false,
			message: "Successfully Loged In",
			user: req.user,
			// token: token,
		});
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});
router.get("/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});
// Create routes for authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get("/google", passport.authenticate("google", ["openid", "profile", "email"]));
// const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

// router.get(
// 	'/google/callback',
// 	passport.authenticate('google', {
// 		successRedirect: `${process.env.CLIENT_URL}`,
// 		failureRedirect: '/login/failed',
// 		// session: false,
// 	}),
// 	// (req, res) => {
// 	// 	const token = generateJWT(req.user);
// 	// 	console.log('token', token);
// 	// 	res.cookie('token', token, { maxAge: 900000, httpOnly: true, secure: false, sameSite: 'none', domain: "https://quizzical-dltk.onrender.com", path: '/' });
// 	// 	res.redirect("https://quizzical-dltk.onrender.com");
// 	// },
// );

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
	// Redirect the user to the frontend with the user data in the query string
	res.redirect(`${process.env.CLIENT_URL}/?user=${encodeURIComponent(JSON.stringify(req.user))}`);
  });


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