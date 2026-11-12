const models = require('../models');
const Post = models.Post;

const makePost = async (req, res) => {
    if(!req.body.songTitle || !req.body.genre ||!req.body.rating || !req.body.description){
        return res.status(400).json({ error: 'All fields required!'});
    }
    if(req.body.rating < 0 || req.body.rating > 5){
        return res.status(400).json({ error: 'Rating must be 0-5'});
    }
    const postData = {
        songTitle: req.body.songTitle,
        genre: req.body.genre,
        rating: req.body.rating,
        description: req.body.description,
        owner: req.session.account._id,
        ownerName: req.body.displayName
    };
    try{
        const newPost = new Post(postData);
        await newPost.save();
        return res.status(201).json({songTitle: newPost.songTitle, genre: newPost.genre, rating: newPost.rating, description: newPost.description});
    } catch(err){
        console.log(err);
        //more than one review of a song is allowed
        //if(err.code === 11000){
        //    return res.status(400).json({ error: 'Post already exists!'});
        //}
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
        const docs = await Post.find().sort({ _id: -1 }).select('songTitle rating genre description').populate('owner', 'displayName').lean().exec();

        return res.json({posts:docs});
    } catch (err){
        console.log(err);
        return res.status(500).json({error: 'Error retrieving posts!'});        
    }

}

const getUserPosts = async (req, res) => {
    try {
       const query = {owner: req.session.account._id};
        const docs = await Post.find(query).sort({ _id: -1 }).select('songTitle rating genre description').populate('owner', 'displayName').lean().exec();
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