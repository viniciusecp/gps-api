const express = require("express");
const routes = express.Router();

const UserController = require("./controllers/UserController");

routes.post("/authentication", UserController.authentication);
routes.post("/getcoordinates/:imei", UserController.getCoordinates);

module.exports = routes;
