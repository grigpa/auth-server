const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.update = (req, res) => {
    User.findOne({
        where: {
            id: req.body.id
        }
    }).then(user => {
        user.update({
            surname: req.body.surname,
            name: req.body.name,
            patronymic: req.body.patronymic,
            series: req.body.series,
            number: req.body.number
        }).then(user => {
            res.send(user);
        })
            .catch(err => {
                res.status(500).send({message: err.message});
            });
    })
}


exports.signup = (req, res) => {

    User.findOne({
        where: {
            login: req.body.login
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Логин уже используется!"
            });
        }
        User.create({
            login: req.body.login,
            surname: req.body.surname,
            name: req.body.name,
            patronymic: req.body.patronymic,
            series: req.body.series,
            number: req.body.number,
            password: bcrypt.hashSync(req.body.password, 8)
        })
            .then(user => {
                res.send(user);
            })
            .catch(err => {
                res.status(500).send({message: err.message});
            });

    });

};

exports.signin = (req, res) => {
    User.findOne({
        where: {
            login: req.body.login
        }
    })
        .then(user => {
            if (!user) {
                return res.status(404).send({message: "Пользователь не найден."});
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Неправильный пароль!"
                });
            }

            var token = jwt.sign({id: user.id}, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            res.status(200).send({
                id: user.id,
                login: user.login,
                surname: user.surname,
                name: user.name,
                patronymic: user.patronymic,
                series: user.series,
                number: user.number,
                accessToken: token
            });
        })
        .catch(err => {
            res.status(500).send({message: err.message});
        });
};
