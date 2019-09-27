var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose");
	methodOverride = require("method-override"),
	expressSanitizer = require("express-sanitizer");

//APP CONFIG
mongoose.connect("mongodb://localhost:27017/blog_app", {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


//DB SCHEMA CONFIG
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title: "What are you eating",
// 	image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1920px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
// 	body: "Food is any substance[1] consumed to provide nutritional support for an organism. It is usually of plant or animal origin, and contains essential nutrients, such as carbohydrates, fats, proteins, vitamins, or minerals. The substance is ingested by an organism and assimilated by the organism's cells to provide energy, maintain life, or stimulate growth."
// });

//========ROUTES=========

//INDEX
app.get("/", (req, res) => {
	res.redirect("/blogs");
})

app.get("/blogs", (req, res) => {
	Blog.find((err, blogs) => {
		if (err) {
			console.log("ERROR while getting blogs!!");
		} else {
			res.render("index", {blogs: blogs});
		}
	})
})

//NEW
app.get("/blogs/new", (req, res) => {
	res.render("new");
})

//CREATE
app.post("/blogs", (req, res) => {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, (err, blog) => {
		if (err) {
			console.log("ERROR while creating new blog!!");
		}else {
			res.redirect("/blogs");
		}
	} )
})

//EDIT
app.get("/blogs/:id/edit", (req, res) => {

	Blog.findById(req.params.id, (err, blog) => {
		res.render("edit", {blog: blog});
	})

})

//UPDATE
app.put("/blogs/:id", (req, res) => {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
		if (err) {
			res.redirect("/blogs");
		}else {
			res.redirect("/blogs/" + req.params.id);
		}
	})

})
//DELETE
app.delete("/blogs/:id", (req, res) => {
	Blog.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			res.redirect("/blogs");
		}else {
			res.redirect("/blogs");
		}
	})
})


//SWOW
app.get("/blogs/:id", (req, res) => {
	Blog.findById(req.params.id, (err, blog) => {
		res.render("preview", {blog: blog});
	})
})


















app.listen(process.env.PORT || 3001, process.env.IP, () => {
	console.log("Blog app is running!");
})