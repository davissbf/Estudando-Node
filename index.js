const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Pergunta = require("./database/Perguntas");

//DATA BASE
const connection = require("./database/database");

connection.
  authenticate()
  .then(()=> {
    console.log("conexão feita com sucesso!");
  })
  .catch((msgErro)=>{
    console.log(msgErro);
  })

// Estou dizendo para o express que o EJS é o renderizador de HTML.
app.set("view engine", "ejs");
app.use(express.static("public"));

//Use bodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/", (req, res)=>{

  //SELECT * FROM perguntas;
  Pergunta.findAll({raw: true, order:[
    ['id','DESC'] //ASC = Crescente || DESC = Decrecente
    
    /*
      Pelo titulo
      ['titulo', 'ASC']
    */
  ]}).then(perguntas =>{
    res.render("index", {
      perguntas: perguntas
    });
  }); 

});

app.get("/perguntar", (req, res)=>{
  res.render("perguntar");
});

app.post("/salvarpergunta", (req, res)=>{
  let titulo = req.body.titulo;
  let descricao = req.body.descricao;

  Pergunta.create({
    titulo: titulo,
    descricao: descricao
  }).then(()=>{
    res.redirect("/")
  });
});

app.listen(8080, ()=>{
  console.log("App rodando");
});



/*
  Antes: <%-include partials/header.ejs%>
  Agora: <%-include ('./partials/header.ejs')%>
*/