mongoose = require("mongoose")
const postSchema = new mongoose.Schema({
    title: String,
    image: String,
});
module.exports = mongoose.model("Post", postSchema);