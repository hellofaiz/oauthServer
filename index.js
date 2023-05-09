const express = require('express');
const fs = require('fs');
const axios = require('axios');
const cors = require('cors');
// const path = require('path');
// passport
const session = require('express-session');
require("dotenv").config();
const passport = require("passport");
const authRoute = require("./routes/auth");
const restorePhotoRoute = require("./routes/restorePhoto");
const motionBlurPhotoRoute = require("./routes/motionBlur");
const passportStrategy = require("./passport");
const cookieParser = require("cookie-parser");
const useragent = require('useragent');
// start
const app = express();
// app.use(express.static('public'));


// app.use(express.static(path.join(__dirname, 'build')));

function customContentSecurityPolicy(req, res, next) {
  const userAgent = req.headers['user-agent'];
  const agent = useragent.parse(userAgent);
  const isSafari = agent.family === 'Safari';

  // Define your Content-Security-Policy directives here
  const baseCsp = "default-src 'self'; script-src 'self'";

  if (isSafari) {
    res.setHeader('Content-Security-Policy', baseCsp);
  } else {
    res.setHeader('Content-Security-Policy', `${baseCsp}; require-trusted-types-for 'script'`);
  }

  next();
}
app.use(customContentSecurityPolicy);


app.set('trust proxy', 1); // Add this line to enable the trust proxy setting



app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', `${process.env.CLIENT_URL}`);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(
  cors({
    origin: `${process.env.CLIENT_URL}` || `${process.env.CLIENT_URL}/restore`|| `${process.env.CLIENT_URL}/motionBlur`|| `${process.env.CLIENT_URL}/auth/google/callback`|| `${process.env.CLIENT_URL}/login`,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    allowedHeaders: "Content-Type,Authorization"
  })
);

app.use(session({
  secret: `${process.env.CLIENT_SECRET}`,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: false,
    secure: true,
    sameSite: 'none',
  }
}));

app.use(passport.initialize());
app.use(passport.session());
// google Auth 
app.use("/auth", authRoute);

// Replicate Models
app.use("/", restorePhotoRoute);
app.use("/", motionBlurPhotoRoute);

// Catch-all route to serve the React index.html file for any other requests
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
// app.get('/', function (req, res) {
//   // req.set('Content-Type', 'text/html; charset=utf-8');
//   res.send("<h1>hello welcome in / route</h1");
// });

const PORT = process.env.PORT || 1429;

app.listen(`${PORT}`, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});