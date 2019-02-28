const db = require("../config/dbConnection");

const Vehicles = db.sequelize.define(
  "bem",
  {
    id: { type: db.Sequelize.INTEGER, primaryKey: true },
    imei: { type: db.Sequelize.STRING },
    name: { type: db.Sequelize.STRING },
    date: { type: db.Sequelize.TIME },
    identificacao: { type: db.Sequelize.STRING },
    cliente: { type: db.Sequelize.INTEGER },
    activated: { type: db.Sequelize.CHAR },
    modo_operacao: { type: db.Sequelize.STRING },
    porta: { type: db.Sequelize.INTEGER },
    liberado: { type: db.Sequelize.CHAR },
    status_sinal: { type: db.Sequelize.CHAR },
    cor_grafico: { type: db.Sequelize.CHAR },
    id_admin: { type: db.Sequelize.INTEGER }
  },
  {
    freezeTableName: true
  }
);
Vehicles.removeAttribute("createdAt");
Vehicles.removeAttribute("updatedAt");

module.exports = Vehicles;
