const db = require("../config/dbConnection");

const User = db.sequelize.define(
  "cliente",
  {
    id: { type: db.Sequelize.INTEGER, primaryKey: true },
    email: { type: db.Sequelize.STRING },
    nome: { type: db.Sequelize.STRING },
    apelido: { type: db.Sequelize.STRING },
    senha: { type: db.Sequelize.TEXT },
    ativo: { type: db.Sequelize.CHAR },
    data_inativacao: { type: db.Sequelize.DATE },
    observacao: { type: db.Sequelize.TEXT },
    master: { type: db.Sequelize.CHAR },
    admin: { type: db.Sequelize.CHAR },
    id_admin: { type: db.Sequelize.INTEGER }
  },
  {
    freezeTableName: true
  }
);
User.removeAttribute("createdAt");
User.removeAttribute("updatedAt");

module.exports = User;
