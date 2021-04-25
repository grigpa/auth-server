module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    login: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    surname: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    patronymic: {
      type: Sequelize.STRING
    },
    series: {
      type: Sequelize.STRING
    },
    number: {
      type: Sequelize.STRING
    },

  });

  return User;
};
