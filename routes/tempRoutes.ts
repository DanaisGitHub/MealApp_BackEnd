// Many functions need to be moved to middleware folder and this freed up



// import modules
import passport from 'passport';
import passportjwt from "passport-jwt";
import bycrpt from 'bcrypt';
import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';

//import self-written files
import { AuthModel } from '../models/authModel';
import { User } from '../models/baseAuth';
import { issueJWT } from '../utils/authUtils'
import { runPassport } from '../config/passport'

// constants
const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');
const db = new AuthModel(User);
const accessTime = 900000 // 15 days
const refreshTime = 900000 * 4 * 24 * 30 // 30 days
runPassport(passport);

const router = Router();
export const authMiddleware = (req: Req, res: Res, next: Next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        console.log(info);
        if (!user) {

            if (info instanceof TokenExpiredError) {
                return res.status(401).send('Token expired');
            } else {
                return res.status(401).send('Unauthorized');
            }
        }
        req.user = user;
        next();
    })(req, res, next);
};

const errorHandler = (err: any, req: Req, res: any, next: any) => {
    console.log("There was an error", err)
    if (err) {
        res.json({ message: "There was a fatal an error", error: err })
    }
}

router.get('/', (req: Req, res, next) => {
    res.send("HELLO")
})
router.get('/error', (req: Req, res: Res, next: Next) => {// how you error handle
    res.send("There's was an error")
    next(errorHandler);

})

router.get('/dev/findAll', async (req: Req, res: Res, next: Next) => { //works
    try {
        const result = await db.devFindAll();
        res.json({ err: false, message: result })
    } catch (err) {
        console.log(err)
        res.json({ err: true, message: err })
    }

})

//added in 
router.post('/signUp', async (req: Req, res, next) => { // semi works need to check all casses+ should be try catches 
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    // hash 
    const salt = await bycrpt.genSalt(10)
    const hashedPassword = await bycrpt.hash(password, salt);

    const signUpVar = await db.signUp({ firstName: firstName, lastName: lastName, email: email, rawPassword: password })
    if (signUpVar.err === true) {
        // should be sending more signigicant error
        res.send("Couldn't sign you up sorry :(")
    }
    else {
        console.log(signUpVar.result)
        const { err, result } = await db.isAlreadyAUserObj(email)// why are we doing this
        if (err) {
            res.send("You apparently were signed up but there was an error signing you up")
        }
        else {
            res.send(`I think you have been signed up, the message I got back is ${result}`);
        }
    }
})

router.post('/login', async (req: Req, res: Res, next: Next) => { // NEED TO CHECK WHEN BUILT FRONT END PROPERLY
    const email = req.body.email;
    const password = req.body.password;
    const refreshToken = issueJWT({ id: email }, true);
    const result = await db.login({ email: email, rawPassword: password, refreshToken: refreshToken.token })
    if (result.err === true) {
        res.send(`Couldn't login you up sorry :( code = ${result.result}`)
    }
    else {
        const accessToken = issueJWT({ id: email })
        const refreshToken = issueJWT({ id: email }, true);
        console.log(result.result)
        // we should be setting cookies here too
        req.headers.authorization = `Bearer ${accessToken}`;
        res.cookie("accessToken", accessToken, { maxAge: accessTime, httpOnly: true })
        res.cookie("refreshToken", refreshToken, { maxAge: refreshTime, httpOnly: true })
        res.status(200).json({ success: true, token: accessToken.token, refreshToken: refreshToken });
    }
})

router.post('/logout', authMiddleware, async (req: Req, res: Res) => { // it think done
    const token = req.cookies.accessToken
    console.log(token)
    const decoded: any = jwt.verify(token, PUB_KEY); // should make not async// type error if not :any see what's going here
    console.log(decoded)
    await db.logout(decoded.id)
    res.clearCookie('accessToken', { maxAge: accessTime, httpOnly: true }) // if options are not exactly same as res.cookie then web browser won't clear
    res.clearCookie('refreshToken', { maxAge: refreshTime, httpOnly: true })
    delete req.headers.authorization; // removes authorisation header // still need to check if this works

})

router.get('/protected', authMiddleware, (req: Req, res: Res, next: Next) => { // it somewhat works !!!!!!!!!

    console.log("Inside protected route here!");
    res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!" });
})

router.post('/refresh_token', async (req: Req, res: Res) => {//////////////////////////////////////////////////////////Error/////////////////////////////////
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken; // assuming correct
        //console.log(refreshToken.token);
        //each user can store a refresh token as part of user, if empty ie logged out, 
        //even if they have a valid refresh token it won't work 
        // if refresh tokens match access token is given
        jwt.verify(refreshToken.token, PUB_KEY, async (err: any, decoded: any) => {
            if (err) {
                console.log("We have an Error" + err);
                // somehow make the user login on front-end
                return res.sendStatus(401).json({ err: err, message: `token incorrect` });
            }
           
            const email: string = decoded.id;
             //console.log(refreshToken.token)
            //const  = decoded
            
            const refreshTokenSame = await db.isRefreshTokenSame({
                id: email,
                refreshToken: refreshToken.token // is comeing back as undefined
            })

            if (!refreshTokenSame.result) {
                res.sendStatus(401).json({ err: err, message: `token incorrect` });
                return;
            }
            const accessToken = issueJWT({ id: email })
            req.headers.authorization = `Bearer ${accessToken}`;
            res.cookie("accessToken", accessToken, { maxAge: refreshTime, httpOnly: true })
            res.json({ accessToken: accessToken });

        });
    } catch (err) {
        console.log(err)
        res.sendStatus(401).json({ err: err, message: `token incorrect` });
    }
});



router.use(errorHandler);

export default router;