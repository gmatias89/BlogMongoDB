//jshint esversion:6

require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");



mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);

//Se setea el contenido a ser enviado a las plantillas

const homeStartingContent = "Bienvenidos a mi blog! Para agregar un post, agrega /compose a la ruta de la pagina web!";
const aboutContent = "Este blog fue realizado como ejercicio en un curso de web developing!";
const contactContent = "Si quieres contactarme enviame un correo a gmatias89@hotmail.com o contactarme por los links que se encuentran en el footer! ";

const app = express();

//se setea el uso de plantillas EJS
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
//se setea la carpeta de recursos
app.use(express.static("public"));


app.get("/", function (req, res) {
  //al ingresar a la pagina, se piden los Posts a la base de datos
  Post.find({}, function (err, foundPosts) {
    //En caso de error:
    if (err) {

      console.log(err);


    } else {
      //si no hubo errores, se renderiza el contenido en la plantila Home de EJS
      res.render("home", {
        startingContent: homeStartingContent,
        posts: foundPosts
      });


    }
  });
});

app.get("/about", function (req, res) {
  //se renderiza el contenido en la pagina pertinente
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function (req, res) {
  //se renderiza el contenido en la pagina pertinente
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/compose", function (req, res) {
  //se renderiza la pagina por la cual se crean nuevos posts
  res.render("compose");
});

app.post("/compose", function (req, res) {
  //Se recibe un Form y se ponen los elementos en un objeto tipo Post de la base de datos 
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  //Se guarda el post recien creado en la base de datos
  post.save(function (err) {
    if (err) {
      console.log(err);


    } else {
      //se logea en consola en caso de no haber errores
      console.log("Post agregado con exito!");
    }
  })

  //se vuelve a redirigir al homepage para ver los posts
  res.redirect("/");

});

app.get("/posts/:postId", function (req, res) {
  //para abrir una pagina especifica de un post, se recibe el id del post
  const requestedPost = req.params.postId;

  //se busca el post por la id recibida en la base de datos
  Post.findById(requestedPost, function (err, post) {
    if (err) {
      console.log(err);

    } else {
      //en caso de encontrarse este post, se recibe un objeto tipo Post de la base de datos y se envia
      //el contenido a la plantilla post para posts individuales
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });




});

//se setea el port por el cual se escuchara segun las especificaciones de Heroku
let port = process.env.PORT;
if (port == null || port == "") {
  //en caso de haber un error en el port de Heroku o en caso de quererlo correr localmente
  //en un terminal node, se utiliza el port 3000
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started on port " + port);
});