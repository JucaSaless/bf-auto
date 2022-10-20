var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcryptjs');

var User = require('../models/user');

router.get('/register', function (req, res) {

    res.render('register', {
        title: 'Registro'
    });

});

router.post('/register', function (req, res) {

    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    req.checkBody('username', 'Informe o nome de usuário!').notEmpty();
    req.checkBody('password', 'Informe a senha!').notEmpty();
    req.checkBody('password2', 'Senhas não conferem!').equals(password);

    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors,
            user: null,
            title: 'Registro'
        });
    } else {
        User.findOne({ username: username }, function (err, user) {
            if (err)
                console.log(err);

            if (user) {
                req.flash('danger', 'Usuário já exite, escolha outro nome!');
                res.redirect('/users/register');
            } else {
                var user = new User({
                    username: username,
                    password: password,
                    admin: 0
                });

                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(user.password, salt, function (err, hash) {
                        if (err)
                            console.log(err);

                        user.password = hash;

                        user.save(function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                req.flash('success', 'Registrado com sucesso!');
                                res.redirect('/users/login')
                            }
                        });
                    });
                });
            }
        });
    }

});


router.get('/login', function (req, res) {

    if (res.locals.user) res.redirect('/');

    res.render('login', {
        title: 'Log in'
    });

});


router.post('/login', function (req, res, next) {

    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);

});

router.get('/logout', function (req, res) {

    req.logout(function (err) {
        req.flash('success', 'Saiu!');
        res.redirect('/users/login');
    });

});

module.exports = router;