const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async(req,res) => {
    const body = req.body;

    if(!body.password || body.password.length < 3) {
        return res.status(400).json({error: 'invalid password'});
    }

    const saltRounds = 10;
    const password = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
        username: body.username,
        name: body.name,
        password
    });
    const savedUser = await user.save();

    res.json(savedUser);
});

usersRouter.get('/', async(req,res) => {
    const result = await User.find({}).populate('blogs',{url: 1, title: 1, author: 1});
    res.json(result.map(x => x.toJSON()));
});

module.exports = usersRouter;