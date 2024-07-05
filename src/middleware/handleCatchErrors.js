const catchErrorMap = {
  login: "Falha em fazer login",
  findAll_users: "Erro ao buscar usuarios",
  findAll_tours: "Erro ao buscar passeios",
  findOne_review: "Error ao achar a passeio",
  create_user: "Não foi possível cadastrar o usuário",
  create_tour: "Não foi possível cadastrar o passeio",
  create_booking: "Não foi possível cadastrar a reserva",
  create_review: "Não foi possível cadastrar a avaliação",
  delete_user: "Error ao eliminar o usuario",
  delete_tour: "Error ao eliminar a passeio",
  delete_booking: "Error ao eliminar a reserva",
  delete_review: "Error ao eliminar a avaliação",
  update_review: "Não foi possível atualizar a avaliação",
};

function handleCatchError(error, res, action) {
  if (error.name === "ValidationError") {
    const errorMessages = error.errors;
    return res.status(400).json({ errors: errorMessages });
  }

  console.log(error.message);
  const errorMessage = catchErrorMap[action] || "Algo deu errado";
  res.status(500).json({
    error: errorMessage,
    details: error,
  });
}

module.exports = handleCatchError;
