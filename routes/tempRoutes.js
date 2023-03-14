"use strict";
// Many functions need to be moved to middleware folder and this freed up
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
// import modules
const passport_1 = __importDefault(require("passport"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = require("express");
const jsonwebtoken_1 = require("jsonwebtoken");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const jsonwebtoken_2 = __importDefault(require("jsonwebtoken"));
//import self-written files
const authModel_1 = require("../models/authModel");
const baseAuth_1 = require("../models/baseAuth");
const authUtils_1 = require("../utils/authUtils");
const passport_2 = require("../config/passport");
// constants
const pathToKey = path_1.default.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs_1.default.readFileSync(pathToKey, 'utf8');
const db = new authModel_1.AuthModel(baseAuth_1.User);
const accessTime = 900000; // 15 days
const refreshTime = 900000 * 4 * 24 * 30; // 30 days
(0, passport_2.runPassport)(passport_1.default);
const router = (0, express_1.Router)();
const authMiddleware = (req, res, next) => {
    passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        console.log(info);
        if (!user) {
            if (info instanceof jsonwebtoken_1.TokenExpiredError) {
                return res.status(401).send('Token expired');
            }
            else {
                return res.status(401).send('Unauthorized');
            }
        }
        req.user = user;
        next();
    })(req, res, next);
};
exports.authMiddleware = authMiddleware;
const errorHandler = (err, req, res, next) => {
    console.log("There was an error", err);
    if (err) {
        res.json({ message: "There was a fatal an error", error: err });
    }
};
router.get('/', (req, res, next) => {
    res.send("HELLO");
});
router.get('/error', (req, res, next) => {
    res.send("There's was an error");
    next(errorHandler);
});
router.get('/dev/findAll', async (req, res, next) => {
    try {
        const result = await db.devFindAll();
        res.json({ err: false, message: result });
    }
    catch (err) {
        console.log(err);
        res.json({ err: true, message: err });
    }
});
//added in 
router.post('/signUp', async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    // hash 
    const salt = await bcrypt_1.default.genSalt(10);
    const hashedPassword = await bcrypt_1.default.hash(password, salt);
    const signUpVar = await db.signUp({ firstName: firstName, lastName: lastName, email: email, rawPassword: password });
    if (signUpVar.err === true) {
        // should be sending more signigicant error
        res.send("Couldn't sign you up sorry :(");
    }
    else {
        console.log(signUpVar.result);
        const { err, result } = await db.isAlreadyAUserObj(email); // why are we doing this
        if (err) {
            res.send("You apparently were signed up but there was an error signing you up");
        }
        else {
            res.send(`I think you have been signed up, the message I got back is ${result}`);
        }
    }
});
router.post('/login', async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const refreshToken = (0, authUtils_1.issueJWT)({ id: email }, true);
    const result = await db.login({ email: email, rawPassword: password, refreshToken: refreshToken.token });
    if (result.err === true) {
        res.send(`Couldn't login you up sorry :( code = ${result.result}`);
    }
    else {
        const accessToken = (0, authUtils_1.issueJWT)({ id: email });
        const refreshToken = (0, authUtils_1.issueJWT)({ id: email }, true);
        console.log(result.result);
        // we should be setting cookies here too
        req.headers.authorization = `Bearer ${accessToken}`;
        res.cookie("accessToken", accessToken, { maxAge: accessTime, httpOnly: true });
        res.cookie("refreshToken", refreshToken, { maxAge: refreshTime, httpOnly: true });
        res.status(200).json({ success: true, token: accessToken.token, refreshToken: refreshToken });
    }
});
router.post('/logout', exports.authMiddleware, async (req, res) => {
    const token = req.cookies.accessToken;
    console.log(token);
    const decoded = jsonwebtoken_2.default.verify(token, PUB_KEY); // should make not async// type error if not :any see what's going here
    console.log(decoded);
    await db.logout(decoded.id);
    res.clearCookie('accessToken', { maxAge: accessTime, httpOnly: true }); // if options are not exactly same as res.cookie then web browser won't clear
    res.clearCookie('refreshToken', { maxAge: refreshTime, httpOnly: true });
    delete req.headers.authorization; // removes authorisation header // still need to check if this works
});
router.get('/protected', exports.authMiddleware, (req, res, next) => {
    console.log("Inside protected route here!");
    res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!" });
});
router.post('/refresh_token', async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken; // assuming correct
        //console.log(refreshToken.token);
        //each user can store a refresh token as part of user, if empty ie logged out, 
        //even if they have a valid refresh token it won't work 
        // if refresh tokens match access token is given
        jsonwebtoken_2.default.verify(refreshToken.token, PUB_KEY, async (err, decoded) => {
            if (err) {
                console.log("We have an Error" + err);
                // somehow make the user login on front-end
                return res.sendStatus(401).json({ err: err, message: `token incorrect` });
            }
            const email = decoded.id;
            //console.log(refreshToken.token)
            //const  = decoded
            const refreshTokenSame = await db.isRefreshTokenSame({
                id: email,
                refreshToken: refreshToken.token // is comeing back as undefined
            });
            if (!refreshTokenSame.result) {
                res.sendStatus(401).json({ err: err, message: `token incorrect` });
                return;
            }
            const accessToken = (0, authUtils_1.issueJWT)({ id: email });
            req.headers.authorization = `Bearer ${accessToken}`;
            res.cookie("accessToken", accessToken, { maxAge: refreshTime, httpOnly: true });
            res.json({ accessToken: accessToken });
        });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(401).json({ err: err, message: `token incorrect` });
    }
});
router.use(errorHandler);
exports.default = router;
