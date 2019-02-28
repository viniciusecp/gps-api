const db = require("../config/dbConnection");

const Gprmc = db.sequelize.define(
  "gprmc",
  {
    id: { type: db.Sequelize.INTEGER, primaryKey: true },
    date: { type: db.Sequelize.TIME },
    imei: { type: db.Sequelize.STRING },
    phone: { type: db.Sequelize.STRING },
    satelliteFixStatus: { type: db.Sequelize.CHAR },
    latitudeDecimalDegrees: { type: db.Sequelize.STRING },
    latitudeHemisphere: { type: db.Sequelize.CHAR },
    longitudeDecimalDegrees: { type: db.Sequelize.STRING },
    longitudeHemisphere: { type: db.Sequelize.CHAR },
    speed: { type: db.Sequelize.FLOAT },
    gpsSignalIndicator: { type: db.Sequelize.CHAR },
    infotext: { type: db.Sequelize.TEXT },
    address: { type: db.Sequelize.TEXT }
  },
  {
    freezeTableName: true
  }
);
Gprmc.removeAttribute("createdAt");
Gprmc.removeAttribute("updatedAt");

module.exports = Gprmc;
