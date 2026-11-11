const models = require('../models');
const Domo = models.Domo;

const makeDomo = async (req, res) => {
    if(!req.body.name || !req.body.age){
        return res.status(400).json({ error: 'Both name and age are required'});
    }
    const domoData = {
        name: req.body.name,
        age: req.body.age,
        owner: req.session.account._id,
        ownerName: req.body.displayName
    };
    try{
        const newDomo = new Domo(domoData);
        await newDomo.save();
        return res.status(201).json({name: newDomo.name, age: newDomo.age});
    } catch(err){
        console.log(err);
        if(err.code === 11000){
            return res.status(400).json({ error: 'Domo already exists!'});
        }
        return res.status(500).json({ error: 'An error occurred'});
    }
    
    }


const makerPage = async (req, res) => {
  return res.render('app');
};

const accountPage = async (req, res) => {
  return res.render('account');
};

const getDomos = async (req,res) => {
    try{
        const docs = await Domo.find().sort({ _id: -1 }).select('name age').populate('owner', 'displayName').lean().exec();

        return res.json({domos:docs});
    } catch (err){
        console.log(err);
        return res.status(500).json({error: 'Error retrieving domos!'});        
    }

}

const getUserDomos = async (req, res) => {
    try {
       const query = {owner: req.session.account._id};
        const docs = await Domo.find(query).sort({ _id: -1 }).select('name age').populate('owner', 'displayName').lean().exec();
        return res.json({ domos: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving domos!' });
    }
};

module.exports = {
    makerPage,
    makeDomo,
    getDomos,
    getUserDomos,
    accountPage
};