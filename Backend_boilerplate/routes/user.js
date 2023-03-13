"use strict";
// import passport from 'passport';
// import { Router } from "express";
// const router = Router();
// const utils = require('../lib/utils'); // what does this do
// router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res, next) => {
//     res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!"});
// });
// // check to see if there's anymore functionality you need to add. 
// // Validate an existing user and issue a JWT
// router.post('/login', function(req, res, next){
//     // get login data from req
//     //search database for login data
//             if (!user) { // user cannot be found
//                 return res.status(401).json({ success: false, msg: "could not find user" });
//             }
//             // Function defined at bottom of app.js
//             const isValid = utils.validPassword(req.body.password, user.hash, user.salt);
//             if (isValid) {// if valid password
//                 const tokenObject = utils.issueJWT(user);//create a new JWT specfic info is stored in 'user'
//                 res.status(200).json({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires });
//             } else {// wrong password
//                 res.status(401).json({ success: false, msg: "you entered the wrong password" });
//             }
//         })
//         .catch((err) => {
//             next(err); // defalut error handling method
//         });
// // need to redo with SQL and proper checks... 
// // don't issue a JWT here they need to login for this.
// // Register a new user
// router.post('/register', function(req, res, next){
//     const saltHash = utils.genPassword(req.body.password);
//     const salt = saltHash.salt;
//     const hash = saltHash.hash;
//     const newUser = new User({
//         username: req.body.username,
//         hash: hash,
//         salt: salt
//     });
//     try {
//         newUser.save()
//             .then((user) => {
//                 res.json({ success: true, user: user });
//             });
//     } catch (err) {
//         res.json({ success: false, msg: err });
//     }
// });
// module.exports = router;
