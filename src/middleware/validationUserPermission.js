const Tour = require("../models/Tour");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

const modelMap = {
  Tour,
  Booking,
  Review,
};

const errorMap = {
  findReview: "revisar as avaliações de este passeio",
  deleteTour: "deletar este passeio",
  deleteBooking: "deletar esta reserva",
  deleteReview: "deletar esta avaliação",
  updateReview: "atualizar esta avaliação",
};

async function checkUserPermission(req, res, id, modelName, error) {
  try {
    const { sub: user_id } = req.payload;

    const model = modelMap[modelName];
    const handlePermissionError = errorMap[error];
    const check = await model.findOne({ where: { id, user_id } });

    if (!check) {
      res.status(403).json({
        message: `Você não tem permissão para ${handlePermissionError}`,
      });
      return false;
    }
    return true;
  } catch (error) {
    res.status(500).json({ message: "Erro ao verificar permissão", error });
    return false;
  }
}

module.exports = checkUserPermission;
