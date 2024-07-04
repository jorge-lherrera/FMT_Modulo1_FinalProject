const yup = require("yup");

const loginSchema = yup
  .object()
  .shape({
    email: yup.string().email().required("O email e obrigatorio"),
    password: yup.string().required("A senha é obrigatoria"),
  })
  .noUnknown(
    true,
    `Os campos adicionais não são permitidos. Campos obrigatorios: email, password`
  );

const userSchema = yup
  .object()
  .shape({
    name: yup.string().required("O nome e obrigatorio"),
    email: yup.string().email().required("O email e obrigatorio"),
    password: yup.string().required("A senha é obrigatoria"),
    birth_date: yup.string().required("A data de nascimento e obrigatoria"),
    user_type: yup
      .string()
      .oneOf(
        ["guia", "turista"],
        "O tipo de usuário deve ser 'guia' ou 'turista'"
      )
      .required("O tipo de usuário é obrigatório"),
  })
  .noUnknown(
    true,
    `Os campos adicionais não são permitidos. Campos obrigatorios: name, email, password, birth_date, user_type`
  );

const tourSchema = yup
  .object()
  .shape({
    tour_title: yup.string().required("O titulo do passeio e obrigatorio"),
    description: yup.string().required("A descripção e obrigatoria"),
    local: yup.string().required("Local e obrigatorio"),
    price: yup
      .number()
      .required("Preço e obrigatorio")
      .positive("O preço deve ser um número positivo")
      .integer("O preço deve ser um número inteiro"),
    date: yup.string().required("A data e obrigatoria"),
    max_number_users: yup
      .number()
      .required("Numero maximo de usuarios e obrigatorio")
      .positive("O numero maximo de usuarios deve ser um número positivo")
      .integer("O numero maximo de usuarios deve ser um número inteiro"),
    user_id: yup
      .number()
      .required("O id do guia que esta criando o passeio e obrigatorio"),
  })
  .noUnknown(
    true,
    "Os campos adicionais não são permitidos. Campos obrigatorios: tour_title, description, local, price, date, max_number_users, user_id"
  );

const bookingSchema = yup
  .object()
  .shape({
    user_id: yup
      .number()
      .required("User ID e obrigatorio")
      .positive("O ID de user deve ser um número positivo")
      .integer("O ID de user deve ser um número inteiro"),
    tour_id: yup
      .number()
      .required("Tour ID e obrigatorio")
      .positive("O ID de tour deve ser um número positivo")
      .integer("O ID de tour deve ser um número inteiro"),
  })
  .noUnknown(
    true,
    "Os campos adicionais não são permitidos. Campos obrigatorios: user_id, tour_id"
  );

const reviewSchema = yup
  .object()
  .shape({
    user_id: yup
      .number()
      .required("User ID e obrigatorio")
      .positive("O ID de user deve ser um número positivo")
      .integer("O ID de user deve ser um número inteiro"),
    tour_id: yup
      .number()
      .required("Tour ID e obrigatorio")
      .positive("O ID de tour deve ser um número positivo")
      .integer("O ID de tour deve ser um número inteiro"),
    scores: yup
      .number()
      .required("A nota é obrigatória")
      .integer("O scores deve ser um número inteiro")
      .min(1, "A nota mínima é 1")
      .max(5, "A nota máxima é 5"),
    comment: yup.string(),
  })
  .noUnknown(
    true,
    "Os campos adicionais não são permitidos. Campos obrigatorios: user_id, tour_id, scores"
  );

module.exports = {
  loginSchema,
  userSchema,
  tourSchema,
  bookingSchema,
  reviewSchema,
};
