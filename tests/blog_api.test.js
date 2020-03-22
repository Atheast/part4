const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

test('get all blogs', async() => {
    const res = await api.get('/api/blogs')

    expect(res.body.length).toBe(2);
});

test('is id defiend', async() => {
    const res = await api.get('/api/blogs');
    res.body.forEach(x => {
        expect(x.id).toBeDefined();
    })

});

test('is blog added', async() => {
    const res = await api.get('/api/blogs');
    const number = res.body.length+1;

    const login = {
        username: 'root',
        password: 'root'
    }

    const user = await api.post('/api/login').send(login);

    const token = user.body.token;

    const newBlog = {
        title: 'Test1',
        author: 'John Madden',
        url: 'http://test.com',
        likes: 21
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization',`bearer ${token}`)
        .expect(200)

    const response = await api.get('/api/blogs');

    const contents = response.body.map(x => x.title);
    
    expect(response.body.length).toBe(number);
    expect(contents).toContain(newBlog.title);
});

test('is blog contains likes', async() => {
    const login = {
        username: 'root',
        password: 'root'
    }

    const user = await api.post('/api/login').send(login);

    const token = user.body.token;

    const newBlog = {
        title: 'Test2',
        author: 'John Madden',
        url: 'http://test.com',
    }

    const res = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization',`bearer ${token}`)

    expect(res.body.likes).toBe(0);
});

test('data and url missing', async() => {
    const login = {
        username: 'root',
        password: 'root'
    }

    const user = await api.post('/api/login').send(login);

    const token = user.body.token;

    const newBlog = {
        author: 'John Madden',
        likes: 20
    }

    if(!newBlog.hasOwnProperty('title') && !newBlog.hasOwnProperty('url')) {
        await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization',`bearer ${token}`)
        .expect(400)
    }
});

test('delete blog', async() => {
    const login = {
        username: 'root',
        password: 'root'
    }

    const user = await api.post('/api/login').send(login);

    const token = user.body.token;

    const res = await api.get('/api/blogs');
    const number = res.body.length-1;
    const id = res.body[0].id;

    await api
        .delete(`/api/blogs/${id}`)
        .set('Authorization',`bearer ${token}`)
        .expect(204);

    const response = await api.get('/api/blogs');
    expect(response.body.length).toBe(number);
});

test('make changes in a blog', async() => {
    const login = {
        username: 'root',
        password: 'root'
    }

    const user = await api.post('/api/login').send(login);

    const token = user.body.token;

    const res = await api.get('/api/blogs');
    const changedBlog = {...res.body[0],title: "changed title"};
    
    const response = await api
        .put(`/api/blogs/${changedBlog.id}`)
        .send(changedBlog)
        .set('Authorization',`bearer ${token}`)
        .expect(200);

    expect(response.body.title).toBe(changedBlog.title);
});

test('adding blog without token', async() => {
    const newBlog = {
        title: 'Test1',
        author: 'John Madden',
        url: 'http://test.com',
        likes: 21
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
});

afterAll(() => {
    mongoose.connection.close();
});

beforeEach(async () =>{
    await Blog.deleteMany({});
    const u = await api.get('/api/users');
    const id = u.body[0].id;

    blogs = [
        {
            title: 'Blog1',
            author: 'John Madden',
            url: 'http://test.com',
            likes: 20,
            user: id
        },
        {
            title: 'Blog2',
            author: 'John Madden',
            url: 'http://test.com',
            likes: 20,
            user: id
        }
    ]
    for(let blog of blogs) {
        let blogObject = new Blog(blog);
        await blogObject.save();
    }
});