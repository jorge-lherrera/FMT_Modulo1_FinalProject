# Titulo: Trip365

Projeto final módulo 1 - Curso Floripa Mais Tec - Senai

## Descrição

Trip365 é uma plataforma que conecta viajantes com guias turísticos locais para oferecer experiências personalizadas. O objetivo é facilitar encontros entre pessoas que desejam explorar destinos de forma autêntica e guias que conheçam bem a região. Este projeto é um MVP (Produto Mínimo Viável), desenvolvido como uma API Rest utilizando Node.js, Express e PostgreSQL.

## Tabela de Conteúdos

- [Instalação](#instalação)
- [Uso](#uso)
- [Endpoints](#endpoints)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Melhorias Futuras](#melhorias-futuras)
- [Autor](#autor)
- [Problemas Resolvidos](#problemas-resolvidos)

## Instalação

Siga estes passos para configurar o ambiente de desenvolvimento e executar a aplicação localmente:

1. Clone o repositório:

   No terminal:
   git clone https://github.com/jorge-lherrera/FMT_Modulo1_FinalProject.git

2. Navegue até o diretório do projeto:

   No terminal:
   cd FMT_Modulo1_FinalProject

3. Instale as dependências:

   No terminal:
   npm install

4. Configure as variáveis de ambiente:

   Crie um arquivo `.env` na raiz do projeto e adicione as variáveis do arquivo:

   .env_example

5. Execute as migrações do banco de dados:

   No terminal:
   npx sequelize db:migrate

6. Executar seeder

   No terminal:

npx sequelize db:seed:all

7. Inicie o servidor:

   Arquivo de inicio - index.js

   No terminal:
   node index.js

   Também é possível instalar o nodemon e executar o arquivo para melhor experiência.

## Uso

Para usar a API, você pode utilizar ferramentas como Postman ou cURL. A seguir, são descritos alguns dos endpoints disponíveis:

### Endpoints

#### Usuários

- **POST /login**: Autentica um usuário.
- **POST /usuario**: Cria um novo usuário.
- **DELETE /usuario**: Exclui um usuário.

#### Passeios

- **POST /passeio**: Cria um novo passeio.
- **GET /passeio**: Obtém uma lista de passeios.
- **DELETE /passeio**: Exclui um passeio.
- **POST /passeio/realizado**: Cria confirmação de usuários que já deram um passeio.

#### Reservas

- **POST /passeio/:id/reserva**: Reserva um passeio.
- **DELETE /passeio/:id/reserva**: Cancela uma reserva.

#### Avaliações

- **POST /passeio/:id/avaliacao**: Cria uma avaliação para um passeio.
- **GET /passeio/:id/avaliacao**: Obtém as avaliações de um passeio.
- **PUT /avaliacao/:id**: Edita uma avaliação.
- **DELETE /avaliacao/:id**: Exclui uma avaliação.

## Tecnologias Utilizadas

- **Node.js**
- **Express**
- **PostgreSQL**
- **Sequelize**
- **JWT**: Para a autenticação.
- **bcrypt**: Para criptografia de senha.
- **yup**: Para validação de dados.
- **Swagger**: Para a documentação da API.

## Melhorias Futuras

- Implementar um sistema de recomendações de passeios baseados nas preferências do usuário.
- Adicionar uma funcionalidade de chat em tempo real entre turistas e guias.
- Melhorar a interface do usuário com um front-end utilizando React ou Angular.

## Autor

- **[Jorge Herrera](https://github.com/jorge-lherrera)**

## Problemas Resolvidos

O Trip365 resolve diversos problemas enfrentados tanto por viajantes quanto por guias turísticos:

- **Conexão direta**: Facilita a conexão direta entre viajantes e guias locais, eliminando intermediários e reduzindo custos.
- **Experiências personalizadas**: Permite aos viajantes encontrar e reservar passeios personalizados que atendem às suas preferências e interesses específicos.
- **Autenticidade**: Promove experiências turísticas autênticas, conectando viajantes com guias que têm conhecimento local profundo.
- **Feedback e confiança**: Oferece um sistema de avaliações que ajuda a construir confiança entre os usuários, permitindo que compartilhem suas experiências e opiniões sobre os passeios.
- **Gestão de reservas**: Simplifica o processo de reserva e cancelamento de passeios, tornando-o mais eficiente e fácil de gerenciar para ambas as partes.
