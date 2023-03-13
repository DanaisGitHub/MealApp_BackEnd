"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModel = exports.initialize = exports.User = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
//connecting to database
exports.sequelize = new sequelize_1.Sequelize('boilerplate', 'boilerplate', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
exports.User = exports.sequelize.define('Users', {
    firstName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    lastName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING, primaryKey: true },
    password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    refreshToken: { type: sequelize_1.DataTypes.STRING, allowNull: true }
});
const initialize = async () => {
    //await Token.sync();// creates a model if not already set up
    await exports.User.sync();
    console.log("Database models initialized");
};
exports.initialize = initialize;
/**
 * abstract Class that provides atomic action to the database
 */
class BaseModel {
    constructor(model) {
        //START OF DDL
        /**
         * creates a new entry into the database
         * @param options object defining how data should be created
         * @returns Object of row created, where more functions can be done directly
         */
        this.create = async (options) => {
            let theReturn = { err: null, result: "" };
            try {
                const result = await this.model.create(options);
                theReturn.err = null;
                theReturn.result = result;
                return theReturn;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to perfrom create database Operation");
            }
        };
        this.destroy = async (options) => {
            let theReturn = { err: null, result: "" };
            try {
                const result = await this.model.destroy(options);
                console.log(result);
                if (result === null) {
                    console.log("Not Found");
                    theReturn.result = 'Not Found';
                    theReturn.err = true;
                    return theReturn;
                }
                theReturn.err = null;
                theReturn.result = result;
                return theReturn;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to perfrom destroy database Operation");
            }
        };
        this.build = async (obj) => {
            let theReturn = { err: null, result: "" };
            try {
                const result = await this.model.build(obj.options);
                if (result === null || result === undefined) {
                    theReturn.result = 'Not Found';
                    theReturn.err = true;
                    return theReturn;
                }
                theReturn.err = null;
                theReturn.result = { created: true };
                return theReturn;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to perfrom build database Operation");
            }
        };
        /**
         * updates certain fields in specific entry
         * @param model The specific row/entry you are refering too eg perosn Jane in Users
         * @param options What you want changing
         * @returns if Successful returns nothing  else throws ERROR
         */
        this.update = async (model, options) => {
            let theReturn = { err: null, result: "" };
            try {
                await model.update(options);
                await model.save();
                theReturn.err = null;
                theReturn.result = null;
                return theReturn;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to perfrom update database Operation");
            }
        };
        // create function bulkCreate
        //END OF DDL
        //START OF DML
        /**
         * finds a specfic row that confroms to optinal clauses
         * @param options and object of conditions
         * @returns if found returns object, if not found returns null
         */
        this.findOne = async (options) => {
            let theReturn = { err: null, result: "" };
            try {
                const result = await this.model.findOne(options);
                if (result === null || result === undefined) {
                    console.log("not found");
                    theReturn.result = null;
                    theReturn.err = true;
                    return theReturn;
                }
                theReturn.err = null;
                theReturn.result = result;
                return theReturn;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to perfrom findOne database Operation");
            }
        };
        this.findAll = async (options) => {
            let theReturn = { err: null, result: "" };
            try {
                const result = await this.model.findAll(options);
                if (result === null || result === undefined) {
                    console.log("not found");
                    theReturn.result = null;
                    theReturn.err = true;
                    return theReturn;
                }
                theReturn.err = null;
                theReturn.result = result;
                return theReturn;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to perfrom findAll database Operation");
            }
        };
        this.findOrCreate = async (options) => {
            let theReturn = { err: null, result: null };
            try {
                const { user, created } = await this.model.findByPk(options);
                theReturn.err = null;
                theReturn.result = { user: user, created: created };
                return theReturn;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to perfrom findOrCreate database Operation");
            }
        };
        /**
         * Finds an instance of primary key in table and return the row of the table
         * @param primaryKey Is the Primary of table you want to find
         * @returns if (err) wil crash, if not found will return not found, will return the table as object (How the function is Sequlize returns it)
         */
        this.findByPkey = async (primaryKey) => {
            let theReturn = { err: null, result: "" };
            try {
                const result = await this.model.findByPk(primaryKey);
                if (result === null) {
                    console.log("not found");
                    theReturn.result = null;
                    return theReturn;
                }
                theReturn.result = result;
                return theReturn;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to perfrom findByPkey database Operation");
            }
        };
        this.findAndCountAll = async (options) => {
            let theReturn = { err: null, result: null };
            try {
                const { count, rows } = await this.model.findAndCountAll(options);
                if (rows === null || rows === undefined) {
                    console.log("not found");
                    theReturn.result = null;
                    return theReturn;
                }
                theReturn.err = null;
                theReturn.result = { count: count, rows: rows };
                return theReturn;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to perfrom findByPkey database Operation");
            }
        };
        // need to make sure query is escaped/ or does SEQULIZE do that for use
        this.customQuery = async (obj) => {
            let theReturn = { err: null, result: "" };
            try {
                const result = await this.model.query(obj.query, obj.options);
                if (result === null || result === undefined) {
                    theReturn.result = 'Not Found';
                    return theReturn;
                }
                theReturn.err = null;
                theReturn.result = result;
                return theReturn;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to perfrom customQuery database Operation");
            }
        };
        this.model = model;
    }
}
exports.BaseModel = BaseModel;
