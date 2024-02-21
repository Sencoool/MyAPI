//express allow u to create webserver and webAPI
//dotenv allow u to manage secrets things like PORT
require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
