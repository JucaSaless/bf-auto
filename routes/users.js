var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcryptjs');
var auth = require('../config/auth');
var isAdmin = auth.isAdmin;

var User = require('../models/user');
const user = require('../models/user');

router.get('/', isAdmin, function (req, res) {

    User.find(function (err, users) {
        if (err)
            console.log(err);

        res.render('admin/users', {
            title: 'Usuários',
            users: users
        });
    });

});

router.get('/register', function (req, res) {

    res.render('admin/register', {
        title: 'Usuário'
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
        res.render('admin/register', {
            errors: errors,
            user: null,
            title: 'Usuário'
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
                    admin: isAdmin ? 1 : 0
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
                                req.flash('success', 'Cadastrado com sucesso!');
                                res.redirect('/users')
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


router.get('/delete-user/:id', isAdmin, function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err) {
        if (err)
            return console.log(err);

        User.find(function (err, users) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.users = users;
            }
        });

        req.flash('success', 'Usuário deletado!');
        res.redirect('/users');
    });
});


module.exports = router;