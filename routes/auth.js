const express = require('express');
const router = express.Router();
const passport = require("passport");
const { generateJWT } = require('../middlewares/generateJWT');
// const path = require('path');
// router.use(express.static(path.join(__dirname, 'build')));

router.get("/login/success", (req, res) => {
	if (req.user) {
		res.status(200).json({
			error: false,
			message: "Successfully Loged In",
			user: req.user,
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
router.get("/google", passport.authenticate("google", ["openid", "profile", "email"]));
// const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/',
		session: false,
	}),
	(req, res) => {
		const token = generateJWT(req.user);
		console.log('token', token);
		res.cookie('x-auth-cookie', token, { maxAge: 900000, httpOnly: false, secure: true, sameSite: 'none', domain: "https://quizzical-dltk.onrender.com", path: '/' });
		res.redirect("https://quizzical-dltk.onrender.com");
	},
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