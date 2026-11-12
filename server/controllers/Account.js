const models = require('../models');
const Account = models.Account;

const loginPage = (req, res) => {
  return res.render('login');
};


const logout = (req, res) => {
    req.session.destroy();
    return res.redirect('/');
};

const login = (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;

    if(!username || !pass){
        return res.status(400).json({error: 'All fields are required!'});
    }

    return Account.authenticate(username, pass, (err, account) => {
        if(err || !account){
            return res.status(401).json({error: 'Wrong username or password!'});
        }
        req.session.account = Account.toAPI(account);
        return res.json({ redirect: '/maker' });
    });
};


const signup = async(req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;
    const pass2 = `${req.body.pass2}`;
    const displayName = `${req.body.displayName}`;
    const securityAnswer = `${req.body.securityAnswer}`;
    const securityQuestion = `${req.body.securityQuestion}`;

    if(!username || !pass || !pass2 || !displayName || !securityAnswer || !securityQuestion){
        return res.status(400).json({error: 'All fields are required!!'});

    }
    if(pass !== pass2){
        return res.status(400).json({error: 'Passwords do not match!!'});
    }

    try{
        const hash = await Account.generateHash(pass);
        //security answer should be hashed too
        const hashAnswer = await Account.generateHash(securityAnswer);
        const newAccount = new Account({username,displayName,securityQuestion,securityAnswer: hashAnswer,password: hash});
        await newAccount.save();
        req.session.account = Account.toAPI(newAccount);
        return res.json({ redirect: '/maker' });
    } catch(err){
        console.log(err);
        if(err.code === 11000){
            return res.status(400).json({error: 'Username or Display already in use!'});
        }
        return res.status(500).json({error: 'An error occurre!'});
    }
};

const getAccount = (req, res) => {
    return res.json({ account: req.session.account });
};


// get security question does what you think it does
const getSecurityQuestion = async (req, res) => {
    try {
        const account = await Account.findById(req.session.account._id);

        if (!account) {
            return res.status(404).json({ error: 'Account not found!' });
        }

        return res.json({ securityQuestion: account.securityQuestion });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: ' security question error!' });
    }
};

// this one uses the old password to change the password
const changePassword = async (req, res) => {
    const oldPassword = `${req.body.oldPassword || ''}`;
    const newPassword = `${req.body.newPassword || ''}`;
    const confirmPassword = `${req.body.confirmPassword || ''}`;

    if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: 'passwoerds must match!' });
    }

    try {
        const account = await Account.findById(req.session.account._id);

        if (!account) {
            return res.status(404).json({ error: 'not found' });
        }

        const validPassword = await Account.verifyHash(oldPassword, account.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Current password is incorrect!' });
        }

        account.password = await Account.generateHash(newPassword);
        await account.save();

        return res.json({ message: 'Password successfully changed!' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'ERror changing password!' });
    }
};

// Resets password using the security answer instead of the old password
//Reset no password ||change yes password
const resetPassword = async (req, res) => {
    const securityAnswer = `${req.body.securityAnswer || ''}`;
    const newPassword = `${req.body.newPassword || ''}`;
    const confirmPassword = `${req.body.confirmPassword || ''}`;

    if (!securityAnswer || !newPassword || !confirmPassword) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: 'passwoerds must match!' });
    }

    try {
        const account = await Account.findById(req.session.account._id);

        if (!account) {
            return res.status(404).json({ error: 'not found' });
        }

        const validAnswer = await Account.verifyHash(securityAnswer, account.securityAnswer);

        if (!validAnswer) {
            return res.status(401).json({ error: 'Security answer is incorrect! :(' });
        }

        account.password = await Account.generateHash(newPassword);
        await account.save();

        return res.json({ message: 'Password successfully reset!' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error resetting password!' });
    }
};


module.exports = {
    loginPage,
    logout,
    login,
    signup,
    getAccount,
    getSecurityQuestion,
    changePassword,
    resetPassword
};