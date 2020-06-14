mongoose = require("mongoose")
const postSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String
});
module.exports = mongoose.model("Post", postSchema);