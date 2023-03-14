// The massive read lines on token.init() are not errors, works just fine but I don't know why it's doing that

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


interface UserAttributes {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    refreshToken?: string;
}


class User extends Model<UserAttributes> implements UserAttributes {
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public password!: string;
    public refreshToken?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}


export const initUserModel = (sequelize: Sequelize) => { // so why does this not all the other definitions but the others do
    User.init(
        {
            firstName: { type: DataTypes.STRING, allowNull: false, },
            lastName: { type: DataTypes.STRING, allowNull: false, },
            email: { type: DataTypes.STRING, primaryKey: true, },
            password: { type: DataTypes.STRING, allowNull: false, },
            refreshToken: { type: DataTypes.STRING(2048), allowNull: true, }
        },
        {
            tableName: 'Users',
            sequelize,
        }
    );
};

export { User };



interface UserLogs {
    date: Date;
    email: number;//foreign key
    foodId: number;//foreign key
    foodIdMass: number;
    customFoodId: number;//foreign key
    customFoodIdMass: number;
    recipeId: number;//foreign key
    excerideId: number;//foreign key
    excerideIdTime: number;
}


class UserLogs extends Model<UserLogs> implements UserLogs {
    public date!: Date;
    public email!: number;
    public foodId!: number;
    public foodIdMass!: number;
    public customFoodId!: number;
    public customFoodIdMass!: number;
    public recipeId!: number;
    public excerideId!: number;
    public excerideIdTime!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}


export const initUserLogsModel = (sequelize: Sequelize) => {
    UserLogs.init(
        {
            date: { type: DataTypes.DATE, allowNull: false },
            email: { type: DataTypes.STRING, primaryKey: true },
            foodId: { type: DataTypes.INTEGER, allowNull: false, },
            foodIdMass: { type: DataTypes.INTEGER, allowNull: false, },
            customFoodId: { type: DataTypes.INTEGER, allowNull: false, },
            customFoodIdMass: { type: DataTypes.INTEGER, allowNull: false, },
            recipeId: { type: DataTypes.INTEGER, allowNull: false, },
            excerideId: { type: DataTypes.INTEGER, allowNull: false, },
            excerideIdTime: { type: DataTypes.INTEGER, allowNull: false, },
        },
        {
            tableName: "UserLogs", sequelize

        });
}






interface Excerises {
    excerideId: number; // primary key
    excerideName: string;
    caloriesPerKgPerMin: number;//really should be a float
}



class Excerises extends Model<Excerises> implements Excerises {
    public excerideId!: number;
    public excerideName!: string;
    public caloriesPerKgPerMin!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}


const initExcerisesModel = (sequelize: Sequelize) => {
    Excerises.init(
        {
            excerideId: { type: DataTypes.INTEGER, primaryKey: true },
            excerideName: { type: DataTypes.STRING, allowNull: false },
            caloriesPerKgPerMin: { type: DataTypes.INTEGER, allowNull: false },
        },
        { tableName: "Excerises", sequelize })
};


interface FoodData {
    foodId: number; // primary key
    foodName: string;
    calories: number;
    sugar: number;//really should be a float from here down
    carbohydrates: number;
    fat: number;
    protein: number;
    fibre: number;
}


class FoodData extends Model<FoodData> implements FoodData {
    public foodId!: number;
    public foodName!: string;
    public calories!: number;
    public sugar!: number;
    public carbohydrates!: number;
    public fat!: number;
    public protein!: number;
    public fibre!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}


const initFoodDataModel = (sequelize: Sequelize) => {
    FoodData.init({
        foodId: { type: DataTypes.INTEGER, primaryKey: true },
        foodName: { type: DataTypes.STRING, allowNull: false },
        calories: { type: DataTypes.INTEGER, allowNull: false },
        sugar: { type: DataTypes.INTEGER, allowNull: false },
        carbohydrates: { type: DataTypes.INTEGER, allowNull: false },
        fat: { type: DataTypes.INTEGER, allowNull: false },
        protein: { type: DataTypes.INTEGER, allowNull: false },
        fibre: { type: DataTypes.INTEGER, allowNull: false }
    },
        { tableName: "FoodData", sequelize })
}


interface RecipeData {
    recipeId: number; // primary key
    recipeName: string;
    recipeCreator: number;
    ingredient: number;// foreign key to foodData
    customIngredient: number;// foreign key to customFoodData
    popularityScore?: number;
}

class RecipeData extends Model<RecipeData> implements RecipeData {
    public recipeId!: number;
    public recipeName!: string;
    public recipeCreator!: number;
    public ingredient!: number;
    public customIngredient!: number;
    public popularityScore?: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initRecipeData = (sequelize: Sequelize) => {
    RecipeData.init({
        recipeId: { type: DataTypes.INTEGER, primaryKey: true },
        recipeName: { type: DataTypes.STRING, allowNull: false },
        recipeCreator: { type: DataTypes.INTEGER, allowNull: false },
        ingredient: { type: DataTypes.INTEGER, allowNull: false },
        customIngredient: { type: DataTypes.INTEGER, allowNull: false },
        popularityScore: { type: DataTypes.INTEGER, allowNull: true },
    },
        { tableName: "RecipeData", sequelize })
}



interface CustomFoodData {
    foodId: number; // primary key
    foodName: string;
    calories: number;
    sugar: number;//really should be a float from here down
    carbohydrates: number;
    fat: number;
    protein: number;
    fibre: number;
}


class CustomFoodData extends Model<CustomFoodData> implements CustomFoodData {
    public foodId!: number;
    public foodName!: string;
    public calories!: number;
    public sugar!: number;
    public carbohydrates!: number;
    public fat!: number;
    public protein!: number;
    public fibre!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initCustomFoodData = (sequelize: Sequelize) => {
    CustomFoodData.init(
        {
            foodId: { type: DataTypes.INTEGER, primaryKey: true },
            foodName: { type: DataTypes.STRING, allowNull: false },
            calories: { type: DataTypes.INTEGER, allowNull: false },
            sugar: { type: DataTypes.INTEGER, allowNull: false },
            carbohydrates: { type: DataTypes.INTEGER, allowNull: false },
            fat: { type: DataTypes.INTEGER, allowNull: false },
            protein: { type: DataTypes.INTEGER, allowNull: false },
            fibre: { type: DataTypes.INTEGER, allowNull: false }
        },
        {
            tableName: 'CustomFoodData',
            sequelize
        }
    );
};




export const initialize = async () => {
    //await Token.sync();// creates a model if not already set up
    try {
        initUserModel(sequelize);
        initCustomFoodData(sequelize);
        initExcerisesModel(sequelize);
        initRecipeData(sequelize);
        initUserLogsModel(sequelize);
        initFoodDataModel(sequelize);
        await sequelize.sync({ force: true }) // should init all models
        //await User.sync({ force: true })
        console.log("Database models initialized")
    }
    catch (err) {
        console.log(err)
        throw new Error("Could not initialize database models: " + err)

    }
}


/**
 * abstract Class that provides atomic action to the database
 */
export abstract class BaseModel {
    model: any
    constructor(model: any) {
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
    protected update = async (model: any, options: any): Promise<StdReturn> => { // if any defalut values not filled, filled with defulat already set.
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

    protected findOrCreate = async (options: any): Promise<StdReturn> => {
        let theReturn: StdReturn = { err: null, result: null };
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
    protected findByPkey = async (primaryKey: any): Promise<StdReturn> => {
        let theReturn: StdReturn = { err: "Primary Key Not Found", result: null };
        try {
            const result = await this.model.findByPk(primaryKey)
            if (result === null) {
                console.log("not found")
                return theReturn
            }
            theReturn.err = null;
            theReturn.result = result
            return theReturn
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to perfrom findByPkey database Operation");
        }
    }

    protected findAndCountAll = async (options: any): Promise<StdReturn> => {
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

