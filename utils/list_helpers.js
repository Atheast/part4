const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    return blogs.reduce((a,b) => a+b.likes,0);
}

const favoriteBlog = (blogs) => {
    const max = Math.max(...blogs.map(x => x.likes));

    return blogs.find(x => x.likes === max);
}


const mostBlogs = (blogs) => {
    const blog = blogs.reduce((a,b) => {
        if (b.author in a) {
            a[b.author]++;
        } else {
            a[b.author] = 1;
        }

        return a;
    },{});

    const max = Math.max(...Object.keys(blog).map(x => blog[x]));
    const author = Object.keys(blog).find(x => blog[x] === max);
    return {
        author,
        blogs: max
    };
}

const mostLikes = (blogs) => {
    const likes = blogs.reduce((a,b) => {
        if(b.author in a) {
            a[b.author] += b.likes;
        } else {
            a[b.author] = b.likes
        }

        return a;
    },{});

    const max = Math.max(...Object.keys(likes).map(x => likes[x]));
    const author = Object.keys(likes).find(x => likes[x] === max);

    return ({
        author,
        likes: max
    });
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}