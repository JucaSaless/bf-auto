var express = require('express');
var router = express.Router();

var Page = require('../models/page');

router.get('/', function (req, res) {
    res.render('index', { title: 'BF Automóveis' });
});

   
// router.get('/', function (req, res) {
//     Page.findOne({slug: 'home'}, function (err, page) {
//         if (err)
//             console.log(err);

//             res.render('index', {
//                 title: page ? page.title : 'Home',
//                 content: page ? page.content : 'Alo'
//             });
//     });
// });

router.get('/:slug', function (req, res) {

    var slug = req.params.slug;

    Page.findOne({slug: slug}, function (err, page) {
        if (err)
            console.log(err);
        
        if (!page) {
            res.redirect('/');
        } else {
            res.render('index', {
                title: page.title,
                content: page.content
            });
        }
    });
    
});

module.exports = router;
