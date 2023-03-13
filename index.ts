import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import path from 'path';

import { sequelize, initialize } from './models/baseAuth'
import api from './routes/tempRoutes';

dotenv.config();
const app = express();

// all routes run through the middleware def app.use(X)
app.use(bodyParser.urlencoded({ extended: false })); // we mihgt not need
app.use(bodyParser.json()) // we might not need 
app.use(cookieParser())
app.use(passport.initialize());
app.use(cors());


// may have to do some vue.js set up asell 
// Where Angular builds to - In the ./angular/angular.json file, you will find this configuration
// at the property: projects.angular.architect.build.options.outputPath
// When you run `ng build`, the output will go to the ./public directory


app.use('/', api)// sending all routes that start with '/' to routes folder

// start the server
app.listen(5000, () => console.log("Server running on port " + 5000));

sequelize.authenticate()
        .then(async () => {
                await initialize();
                console.log('DB connection successful');
        })
        .catch((error) => {
                console.log('DB connection Failed becuase: ', error)
        });

// check if connected to Database



