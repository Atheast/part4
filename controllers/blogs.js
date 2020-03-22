const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async(req, res) => {
    const result = await Blog.find({}).populate('user',{username:1, name:1});

    return res.json(result.map(x => x.toJSON()));
});
  
blogsRouter.post('/', async (req, res) => {
    const body = req.body;

    const decodedToken = jwt.verify(req.token, process.env.SECRET);

    if(!req.token || !decodedToken.id) {
      return res.status(401).json({error: 'token missing or invalid'});
    }

    const keys = Object.keys(body);

    if(!keys.includes('title') && !keys.includes('url')) {
      return res.status(400).end();
    }

    if(!body.hasOwnProperty('likes')) {
      body.likes = 0;
    }

    const user = await User.findById(decodedToken.id);

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    });

    user.blogs = user.blogs.concat(blog);
    user.save();
  
    const savedBlog = await blog.save();
    res.json(savedBlog.toJSON());
});

blogsRouter.delete('/:id',async (req,res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if(!req.token || !decodedToken.id) {
    return res.status(401).json({error: 'token missing or invalid'});
  }

  const blog = await Blog.findById(req.params.id);

  if(!(blog.user.toString() === decodedToken.id.toString())) {
    return res.status(401).json({error: 'unauthorized user'});
  }

  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

blogsRouter.put('/:id', async(req,res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if(!req.token || !decodedToken.id) {
    return res.status(401).json({error: 'token missing or invalid'});
  }

  const blogU = await Blog.findById(req.params.id);
  
  if(!(blogU.user.toString() === decodedToken.id.toString())) {
    return res.status(401).json({error: 'unauthorized user'});
  }

  const body =  req.body;
  body.user = blogU.user;
  const blog = new Blog(body).toJSON();

  const result = await Blog.findByIdAndUpdate(req.params.id,blog,{new: true});
  res.json(result.toJSON()); 
});


module.exports = blogsRouter;