import fs from 'fs';
import path from 'path';
// SQL 
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { AuthModel } from '../models/authModel';
import { User } from '../models/baseAuth';

const db = new AuthModel(User);
const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');



const localStrategy = new LocalStrategy(// don't really know what this does
    async (username: string, password: string, done) => {
        try {
            const { err, result } = await db.isAlreadyAUserObj(username);
            if (!result) {
                return done(null, false);
            }
            const isValid = await db.comparePasswords(password, result.password);
            if (!isValid) {
                return done(null, false);
            }
            return done(null, result);
        } catch (err) {
            return done(err);
        }
    },
)

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorthims: ['RS256'],
    ignoreExpiration: false
}

const strategy = new JwtStrategy(options, async (payload, done) => { // don't really know what this does
    try {
        const { err, result } = await db.isAlreadyAUserObj(payload.id); // I have defined as email here, need to change it 
        if (err) {
            done(err)
            console.log("in stratergy err or not found not found  :" + err)
            return done(err)
        }
        else if (!result) {
            return done(null, false); //not found
        }
        else {
            return done(null, result) // found
        }
    }
    catch (err) {
        console.log("In strategy couldn't log user in: " + err)
        // done(err) // should we put this in there
        throw new Error("In strategy couldn't log user in: " + err)
    }
})

export const runPassport = async (passport: any) => {
    await passport.use(localStrategy);
    await passport.use(strategy)

}