async function getPostAuthor(postId, cachedAuthors = {}) {
    const postResponse = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}`
    );
    if (!postResponse.ok) {
        throw new Error(`Failed to fetch the post with id ${postId}`);
    }
    const postData = await postResponse.json();
    const authorId = postData.userId;
    if (cachedAuthors[authorId]) {
        return cachedAuthors[authorId];
    }
    const authorResponse = await fetch(
        `https://jsonplaceholder.typicode.com/users/${authorId}`
    );
    if (!authorResponse.ok) {
        throw new Error(`Failed to fetch the user with id ${authorId}`);
    }
    const authorData = await authorResponse.json();
    cachedAuthors[authorId] = authorData;
    return authorData;
}
async function getPostsAuthors(postIds) {
    const cachedAuthors = {};
    const authors = [];

    for (const postId of postIds) {
        try {
            const author = await getPostAuthor(postId, cachedAuthors);
            authors.push(author);
        } catch (error) {
            throw new Error("Failed to fetch the author of one of the posts");
        }
    }

    return authors;
}
async function getCorrectAuthors() {
    try {
        const authors = await getPostsAuthors([1, 11, 12]);
        console.log(authors[0].name); // Leanne Graham
        console.log(authors[1].name); // Ervin Howell
        console.log(authors[2].name); // Ervin Howell
    } catch (error) {
// no errors should occur
    }
}
async function getIncorrectAuthors() {
    try {
        const authors = await getPostsAuthors([1, 9999999]);
    } catch (error) {
        console.log(error.message); // Failed to fetch the author of one of the posts
    }
}
getCorrectAuthors();
getIncorrectAuthors();