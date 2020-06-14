//seed
var posts = [
    {
        title: "Randompost",
        image: "https://images.unsplash.com/photo-1591993221022-c3b5ee009325?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"
    },
    {
        title: "Cat",
        image: "https://images.unsplash.com/photo-1532386236358-a33d8a9434e3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=678&q=80"
    },
    {
        title: "again",
        image: "https://images.unsplash.com/photo-1591993221022-c3b5ee009325?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"
    }
]
async function seedDB(){
    try {
        await Post.deleteMany({});
        console.log("deleted posts")
        Post.create(posts)
        console.log("created posts")
    } catch (error) {
        console.log(err)
    }
}
module.exports = seedDB;