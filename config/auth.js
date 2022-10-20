exports.isUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('danger', 'É preciso estar logado para acessar.');
        res.redirect('/users/login');
    }
}

exports.isAdmin = function(req, res, next) {
    if (req.isAuthenticated() && res.locals.user.admin == 0) {
        next();
    } else {
        req.flash('danger', 'Acesso somente para administradores.');
        res.redirect('/users/login');
    }
}
