"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueJWT = exports.genPassword = exports.validPassword = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// no idea rn
const pathToKey = path_1.default.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs_1.default.readFileSync(pathToKey, 'utf8');
const validPassword = (password, hash, salt) => {
    var hashVerify = crypto_1.default.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
};
exports.validPassword = validPassword;
const genPassword = (password) => {
    var salt = crypto_1.default.randomBytes(32).toString('hex');
    var genHash = crypto_1.default.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return {
        salt: salt,
        hash: genHash
    };
};
exports.genPassword = genPassword;
const issueJWT = (user, refresh = false) => {
    let id = user.id;
    let expiresIn;
    let token;
    if (refresh) {
        expiresIn = '30d';
        let id = user.id + "!"; // makes sure refresh token cannot be used as access token
    }
    else {
        expiresIn = '10m';
    }
    const payload = {
        id: id,
        iat: Math.floor(Date.now() / 1000),
    };
    const signedToken = jsonwebtoken_1.default.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });
    if (!refresh) {
        token = signedToken; // for authorization header need to add on Bearer at start
    }
    else {
        token = signedToken;
    }
    return {
        token: token,
        expires: expiresIn
    };
};
exports.issueJWT = issueJWT;
