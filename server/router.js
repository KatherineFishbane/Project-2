const controllers = require('./controllers');
const mid = require('./middleware');
const router = (app) => {
    app.get('/getPosts', mid.requiresLogin, controllers.Post.getPosts);
    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
    app.get('/getUserPosts', mid.requiresLogin, controllers.Post.getUserPosts);


    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.get('/logout', mid.requiresLogin,controllers.Account.logout);
    app.get('/maker', mid.requiresLogin, controllers.Post.makerPage);
    app.post('/maker', mid.requiresLogin, controllers.Post.makePost);
    app.get('/account', mid.requiresLogin, controllers.Post.accountPage);
    app.get('/getAccount', mid.requiresLogin, controllers.Account.getAccount);
    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;