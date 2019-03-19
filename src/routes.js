const express = require("express");
const routes = express.Router();

const UserController = require("./controllers/UserController");

routes.post("/authentication", UserController.authentication);
routes.post("/getcoordinates/:imei", UserController.getCoordinates);
routes.post("/gethistory/:imei", UserController.getHistory);

module.exports = routes;
