import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

// no idea rn
const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

export const validPassword = (password: any, hash: any, salt: any) => {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

export const genPassword = (password: any) => {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    return {
        salt: salt,
        hash: genHash
    };
}

export const issueJWT = (user: any, refresh = false) => { // could we do access and refresh with difference time vars ....
    let id = user.id;
    let expiresIn;
    let token;
    if (refresh){
         expiresIn = '30d';
         let id = user.id+"!";// makes sure refresh token cannot be used as access token
    }
    else{
         expiresIn = '10m';
    }
    
    const payload = {
        id: id,
        iat: Math.floor(Date.now() / 1000),
    };

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

    if (!refresh){
        token = signedToken; // for authorization header need to add on Bearer at start
    }
    else{
        token = signedToken;
    }

    return {
        token:token,
        expires: expiresIn
    }
}

