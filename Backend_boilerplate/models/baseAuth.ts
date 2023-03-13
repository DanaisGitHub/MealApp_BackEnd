import {
    Association, DataTypes, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin,
    HasManySetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, Model, ModelDefined, Optional,
    Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey,
} from 'sequelize';
import { StdReturn } from '../types/types';
import mysql from "mysql2";

//connecting to database
export const sequelize = new Sequelize('boilerplate', 'boilerplate', 'password', {
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



export const User = sequelize.define('Users', { // need to add tokens I think
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, primaryKey: true },
    password: { type: DataTypes.STRING, allowNull: false },
    refreshToken:{ type:DataTypes.STRING, allowNull: true}
});


export const initialize = async () => {
    //await Token.sync();// creates a model if not already set up
    await User.sync();
    console.log("Database models initialized")
}



/**
 * abstract Class that provides atomic action to the database
 */
export abstract class BaseModel {
    model:any
    constructor(model:any){
        this.model = model
    }
    //START OF DDL
    /**
     * creates a new entry into the database 
     * @param options object defining how data should be created
     * @returns Object of row created, where more functions can be done directly
     */
    protected create = async (options: any): Promise<StdReturn> => { //would like options to be type of model
        let theReturn: StdReturn = { err: null, result: "" };
        try {
            const result = await this.model.create(options)
            theReturn.err = null;
            theReturn.result = result
            return theReturn
        }
        catch (err) {
            console.log(err)
            throw new Error("Failed to perfrom create database Operation");
        }
    }


    protected destroy = async (options: any): Promise<StdReturn> => { //models = USER // options = OPTIONS
        let theReturn: StdReturn = { err: null, result: "" };
        try {
            const result = await this.model.destroy(options)
            console.log(result)
            if (result === null) {
                console.log("Not Found");
                theReturn.result = 'Not Found';
                theReturn.err = true;
                return theReturn;
            }
            theReturn.err = null;
            theReturn.result = result
            return theReturn;
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to perfrom destroy database Operation");
        }
    }

    protected build = async (obj: { model: any, options: any }): Promise<StdReturn> => { // if any defalut values not filled, filled with defulat already set.

        let theReturn: StdReturn = { err: null, result: "" };
        try {
            const result = await this.model.build(obj.options)
            if (result === null || result === undefined) {
                theReturn.result = 'Not Found'
                theReturn.err = true;
                return theReturn
            }
            theReturn.err = null;
            theReturn.result = { created: true }
            return theReturn
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to perfrom build database Operation");
        }
    }

    /**
     * updates certain fields in specific entry
     * @param model The specific row/entry you are refering too eg perosn Jane in Users
     * @param options What you want changing
     * @returns if Successful returns nothing  else throws ERROR
     */
    protected update = async (model:any,options: any): Promise<StdReturn> => { // if any defalut values not filled, filled with defulat already set.
        let theReturn: StdReturn = { err: null, result: "" };
        try {
            await model.update(options)
            await model.save();
            theReturn.err = null;
            theReturn.result = null
            return theReturn
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to perfrom update database Operation");
        }
    }

    // create function bulkCreate

    //END OF DDL
    //START OF DML

    /**
     * finds a specfic row that confroms to optinal clauses
     * @param options and object of conditions
     * @returns if found returns object, if not found returns null 
     */
    protected findOne = async (options: any): Promise<StdReturn> => {
        let theReturn: StdReturn = { err: null, result: "" };
        try {
            const result = await this.model.findOne(options)
            if (result === null || result === undefined) {
                console.log("not found")
                theReturn.result = null
                theReturn.err = true;
                return theReturn
            }
            theReturn.err = null;
            theReturn.result = result
            return theReturn
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to perfrom findOne database Operation");
        }
    }

    protected findAll = async (options: any): Promise<StdReturn> => {
        let theReturn: StdReturn = { err: null, result: "" };
        try {
            const result = await this.model.findAll(options)
            if (result === null || result === undefined) {
                console.log("not found")
                theReturn.result = null
                theReturn.err = true;
                return theReturn
            }
            theReturn.err = null;
            theReturn.result = result
            return theReturn
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to perfrom findAll database Operation");
        }
    }

    protected findOrCreate = async (options: any ): Promise<StdReturn> => {
        let theReturn: StdReturn = { err: null, result: null};
        try {
            const { user, created } = await this.model.findByPk(options)
            theReturn.err = null;
            theReturn.result = { user: user, created: created }
            return theReturn
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to perfrom findOrCreate database Operation");
        }
    }
    /**
     * Finds an instance of primary key in table and return the row of the table
     * @param primaryKey Is the Primary of table you want to find
     * @returns if (err) wil crash, if not found will return not found, will return the table as object (How the function is Sequlize returns it)
     */
    protected findByPkey = async (primaryKey: any ): Promise<StdReturn> => {
        let theReturn: StdReturn = { err: null, result: "" };
        try {
            const result = await this.model.findByPk(primaryKey)
            if (result === null) {
                console.log("not found")
                theReturn.result = null
                return theReturn
            }
            theReturn.result = result
            return theReturn
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to perfrom findByPkey database Operation");
        }
    }

    protected findAndCountAll = async (options: any ): Promise<StdReturn> => {
        let theReturn: StdReturn = { err: null, result: null };
        try {
            const { count, rows } = await this.model.findAndCountAll(options)
            if (rows === null || rows === undefined) {
                console.log("not found")
                theReturn.result = null
                return theReturn
            }
            theReturn.err = null;
            theReturn.result = { count: count, rows: rows }
            return theReturn
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to perfrom findByPkey database Operation");
        }
    }

    // need to make sure query is escaped/ or does SEQULIZE do that for use
    protected customQuery = async (obj: { model: any, query: string, options: any }): Promise<StdReturn> => {

        let theReturn: StdReturn = { err: null, result: "" };
        try {
            const result = await this.model.query(obj.query, obj.options)
            if (result === null || result === undefined) {
                theReturn.result = 'Not Found'
                return theReturn
            }
            theReturn.err = null;
            theReturn.result = result
            return theReturn
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to perfrom customQuery database Operation");
        }
    }



    
}

