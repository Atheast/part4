const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const api = supertest(app);

test('adding user', async() => {
    const res = await User.find({});
    const number = res.length+1;

    const user = {
        username: 'john',
        name: 'madden',
        password: '12345'
    };
    
    await api
        .post('/api/users')
        .send(user)
        .expect(200);

    const response = await User.find({});
    const users = response.map(x => x.toJSON());

    expect(users.length).toBe(number);
    
    const usernames = users.map(x => x.username);
    expect(usernames).toContain(user.username);
});

describe('adding invalid user', ()=>{
    test('adding user without password', async() => {
        const res = await User.find({});
        const number = res.length;
    
        const user = {
            username: 'john',
            name: 'madden',
        };
        
        await api
            .post('/api/users')
            .send(user)
            .expect(400);
    
        const response = await User.find({});
    
        expect(response.length).toBe(number);
    });

    test('adding user without username', async() => {
        const res = await User.find({});
        const number = res.length;
    
        const user = {
            name: 'madden',
            password: '1111'
        };
        
        await api
            .post('/api/users')
            .send(user)
            .expect(400);
    
        const response = await User.find({});
    
        expect(response.length).toBe(number);
    });

    test('adding user with short password', async() => {
        const res = await User.find({});
        const number = res.length;
    
        const user = {
            username: 'john',
            name: 'madden',
            password: '11'
        };
        
        await api
            .post('/api/users')
            .send(user)
            .expect(400);
    
        const response = await User.find({});
    
        expect(response.length).toBe(number);
    });

    test('adding user with short username', async() => {
        const res = await User.find({});
        const number = res.length;
    
        const user = {
            username: 'jo',
            name: 'madden',
        };
        
        await api
            .post('/api/users')
            .send(user)
            .expect(400);
    
        const response = await User.find({});
    
        expect(response.length).toBe(number);
    });

    test('adding user with repeated username', async() => {
        const res = await User.find({});
        const number = res.length;
    
        const user = {
            username: 'root',
            name: 'madden',
            password: '1332'
        };
        
        await api
            .post('/api/users')
            .send(user)
            .expect(400);
    
        const response = await User.find({});
    
        expect(response.length).toBe(number);
    });
});

beforeEach(async() => {
    await User.deleteMany({});

    const password = await bcrypt.hash('root',10);
    const user = new User({username: 'root', password});

    await user.save();
});

afterAll(() => {
    mongoose.connection.close();
})