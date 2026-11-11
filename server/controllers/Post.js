const models = require('../models');
const Post = models.Post;

const makePost = async (req, res) => {
    if(!req.body.name || !req.body.age){
        return res.status(400).json({ error: 'Both name and age are required'});
    }
    const postData = {
        name: req.body.name,
        age: req.body.age,
        owner: req.session.account._id,
        ownerName: req.body.displayName
    };
    try{
        const newPost = new Post(postData);
        await newPost.save();
        return res.status(201).json({name: newPost.name, age: newPost.age});
    } catch(err){
        console.log(err);
        if(err.code === 11000){
            return res.status(400).json({ error: 'Post already exists!'});
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

const getPosts = async (req,res) => {
    try{
        const docs = await Post.find().sort({ _id: -1 }).select('name age').populate('owner', 'displayName').lean().exec();

        return res.json({posts:docs});
    } catch (err){
        console.log(err);
        return res.status(500).json({error: 'Error retrieving posts!'});        
    }

}

const getUserPosts = async (req, res) => {
    try {
       const query = {owner: req.session.account._id};
        const docs = await Post.find(query).sort({ _id: -1 }).select('name age').populate('owner', 'displayName').lean().exec();
        return res.json({ posts: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving posts!' });
    }
};

module.exports = {
    makerPage,
    makePost,
    getPosts,
    getUserPosts,
    accountPage
};