const User = require("../models/User");
const Vehicles = require("../models/Vehicles");
const Gprmc = require("../models/Gprmc");
const db = require("../config/dbConnection");
const crypto = require("crypto");

async function userAuthentication(email, senha) {
  senha = crypto
    .createHash("md5")
    .update(senha)
    .digest("hex");

  try {
    const response = await User.findAll({
      where: {
        [db.Sequelize.Op.or]: [{ email }, { apelido: email }],
        senha
      }
    });
    return response;
  } catch (err) {
    console.log("Erro: " + err);
    return { Erro: err };
  }
}

// Calculo das coordenadas e montando o objeto final. Convertendo coordenadas do modo GPRS para GPS, apenas latitudeDecimalDegrees
function convertCoordinates(dados) {
  const dadosFinais = { coordinates: [] };

  dados.forEach(data => {
    var { date, latitudeDecimalDegrees, longitudeDecimalDegrees, speed } = data;

    date = new Date(date.getTime() - (360 - date.getTimezoneOffset()) * 60000); // GAMBIARRA
    // date = new Date(date.getTime() - 360 * 60000); // CLOUD

    // latitude
    // if (latitudeDecimalDegrees.length == 9)
    // por causa do rastreador que tava mandado 9 digitos de latitude, retirado if acima
    latitudeDecimalDegrees = "0" + latitudeDecimalDegrees;
    var g = parseFloat(latitudeDecimalDegrees.substring(0, 3));
    var d = parseFloat(latitudeDecimalDegrees.substring(3));
    latitudeDecimalDegrees = g + d / 60;
    if (data.latitudeHemisphere === "S")
      latitudeDecimalDegrees = latitudeDecimalDegrees * -1;

    // longitude
    if (longitudeDecimalDegrees.length == 9)
      longitudeDecimalDegrees = "0" + longitudeDecimalDegrees;
    var g = parseFloat(longitudeDecimalDegrees.substring(0, 3));
    var d = parseFloat(longitudeDecimalDegrees.substring(3));
    longitudeDecimalDegrees = g + d / 60;
    if (data.latitudeHemisphere === "S")
      longitudeDecimalDegrees = longitudeDecimalDegrees * -1;

    // velocidade
    speed = parseFloat(speed) * 1.60934;

    dadosFinais.coordinates.push({
      date,
      latitudeDecimalDegrees,
      longitudeDecimalDegrees,
      speed
    });
  });

  return dadosFinais;
}

module.exports = {
  async authentication(req, res) {
    var emailUsuario = req.body.email;
    var senhaUsuario = req.body.senha;

    req.assert("email", "Email é obrigatório").notEmpty();
    req.assert("senha", "Senha é obrigatória").notEmpty();

    var erros = req.validationErrors();
    if (erros) return res.json(erros);

    var response = await userAuthentication(emailUsuario, senhaUsuario);
    if (response.length <= 0)
      return res.json({ Erro: "Usúario não autenticado" });

    const { id, email, nome, apelido } = response[0];

    try {
      response = await Vehicles.findAll({ where: { cliente: id } });
    } catch (err) {
      console.log("Erro: " + err);
      return res.json({ Erro: err });
    }

    const dadosFinais = {
      id,
      email,
      nome,
      apelido,
      veiculos: []
    };

    response.forEach(data => {
      const { imei, name } = data;
      dadosFinais.veiculos.push({ imei, veiculo: name });
    });

    return res.json(dadosFinais);
  },

  async getCoordinates(req, res) {
    var email = req.body.email;
    var senha = req.body.senha;

    var response = await userAuthentication(email, senha);
    if (response.length <= 0)
      return res.json({ Erro: "Usúario não autenticado" });

    var imei = req.params.imei;

    try {
      response = await Gprmc.findAll({
        where: { imei },
        limit: 10,
        order: [["id", "DESC"]]
      });
    } catch (err) {
      console.log("Erro: " + err);
      return res.json({ Erro: err });
    }

    const dadosFinais = convertCoordinates(response);
    return res.json(dadosFinais);
  },

  async getHistory(req, res) {
    var email = req.body.email;
    var senha = req.body.senha;

    var response = await userAuthentication(email, senha);
    if (response.length <= 0)
      return res.json({ Erro: "Usúario não autenticado" });

    var imei = req.params.imei;
    var dataInicio = req.body.dataInicio;
    var horaInicio = req.body.horaInicio;
    var dataFinal = req.body.dataFinal;
    var horaFinal = req.body.horaFinal;

    var dataInicioSql =
      dataInicio.split("/")[2] +
      "-" +
      dataInicio.split("/")[1] +
      "-" +
      dataInicio.split("/")[0] +
      " " +
      horaInicio;
    var dataFinalSql =
      dataFinal.split("/")[2] +
      "-" +
      dataFinal.split("/")[1] +
      "-" +
      dataFinal.split("/")[0] +
      " " +
      horaFinal;

    try {
      response = await Gprmc.findAll({
        where: {
          imei,
          date: { [db.Sequelize.Op.between]: [dataInicioSql, dataFinalSql] }
        },
        // limit: 30,
        order: [["id", "ASC"]]
      });
    } catch (err) {
      console.log("Erro: " + err);
      return res.json({ Erro: err });
    }

    const dadosFinais = convertCoordinates(response);
    return res.json(dadosFinais);
  }
};
