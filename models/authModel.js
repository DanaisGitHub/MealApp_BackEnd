"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModel = void 0;
const baseAuth_1 = require("./baseAuth");
const bcrypt_1 = __importDefault(require("bcrypt"));
// pre-processing & storage goes in here
class AuthModel extends baseAuth_1.BaseModel {
    constructor() {
        super(...arguments);
        this.signUp = async (obj) => {
            // check to see if already exists
            // check data is correct (should use validator software)
            let isUser = await this.isAlreadyAUserBool(obj.email); // 2 db searches when we could do 1
            if (isUser) {
                //user does exists
                console.log("User Exsits");
                return { err: true, result: "User Exsits" };
            }
            const hash = await this.createHash(obj.rawPassword);
            if (hash.err) { // techinally don't need
                console.log(hash.err);
                console.log("problem when hashing password");
                throw new Error("problem when hashing password");
            }
            const hashedPassword = hash.result;
            const { err, result } = await this.create({ firstName: obj.firstName, password: hashedPassword, email: obj.email, lastName: obj.lastName });
            if (err) {
                console.log(err);
                throw Error("Could't save details");
            }
            else {
                return result;
            }
        };
        // -1 means not found, -2 means passwords incorrect
        this.login = async (obj) => {
            try {
                const { err, result } = await this.findByPkey(obj.email);
                if (err) {
                    return { err: err, result: null }; // I don't think this ever runs
                }
                if (result === null) {
                    //not found, already console.logged
                    return { err: true, result: -1 };
                }
                const user = result;
                await this.update(user, { refreshToken: obj.refreshToken });
                const passwordMatch = await this.comparePasswords(obj.rawPassword, user.password);
                if (!passwordMatch.result) {
                    console.log("passwords don't match");
                    return { err: true, result: -2 };
                }
                return { err: null, result: result };
            }
            catch (err) {
                console.log(err);
                throw new Error("Login error");
            }
        };
        this.logout = async (email) => {
            try {
                //reomve refresh token from db
                const { err, result } = await this.isAlreadyAUserObj(email);
                if (err) {
                    console.log(`Couldn't log User out ${err}`);
                    throw new Error(`Couldn't log User out ${err}`);
                }
                const user = result;
                this.update(user, { refreshToken: null });
            }
            catch (err) {
                console.log(err);
                throw new Error(`Couldn't log user out ${err}`);
            }
        };
        this.isAlreadyAUserObj = async (primaryKey) => {
            try {
                const { err, result } = await this.findByPkey(primaryKey);
                if (err) {
                    return { err: err, result: result };
                }
                if (result === null) {
                    return { err: err, result: result };
                }
                else {
                    return { err: err, result: result };
                }
            }
            catch (err) {
                console.log(err);
                throw new Error(`Problem when trying to find user func=(isAlreadyAUserObj) ${err}}`);
            }
        };
        this.isAlreadyAUserBool = async (primaryKey) => {
            try {
                const { err, result } = await this.findByPkey(primaryKey);
                if (err) {
                    return false;
                }
                if (result === null) {
                    return false;
                }
                else {
                    return true;
                }
            }
            catch (err) {
                console.log(err);
                throw new Error("Problem when trying to find user isAlreadyAUserBool");
            }
        };
        this.createHash = async (rawPassword) => {
            try {
                const salt = await bcrypt_1.default.genSalt(10);
                const hashedPassword = await bcrypt_1.default.hash(rawPassword, salt);
                return { err: null, result: hashedPassword };
            }
            catch (err) {
                console.log(err);
                throw new Error("Error when hashing password");
            }
        };
        this.comparePasswords = async (rawPassword, hashedPassword) => {
            try {
                const result = await bcrypt_1.default.compare(rawPassword, hashedPassword);
                return { err: null, result: result };
            }
            catch (err) {
                console.log(err);
                throw new Error("Couldn't compare passwords");
            }
        };
        // 
        this.isRefreshTokenSame = async (obj) => {
            try {
                const { id, refreshToken } = obj;
                console.log(id);
                const { err, result } = await this.isAlreadyAUserObj(id);
                const user = result;
                console.log("err =" + err);
                if (err) {
                    console.log(err);
                    throw new Error(`Couldn't check if refresh tokens are the same: ${err}`);
                }
                if (user.refreshToken === null) {
                    console.log("User doesnt have a refresh token");
                    return { err: true, result: false };
                }
                if (refreshToken !== user.refreshToken) {
                    return { err: true, result: false };
                }
                return { err: false, result: true };
            }
            catch (err) {
                console.log(err);
                throw new Error(`coudn't check refresh tokens at this time ${err}`);
            }
        };
        this.devFindAll = async () => {
            try {
                const { err, result } = await this.findAll({});
                const database = JSON.stringify(result);
                console.log(result);
                console.log(database);
                return database;
            }
            catch (err) {
            }
        };
    }
}
exports.AuthModel = AuthModel;
