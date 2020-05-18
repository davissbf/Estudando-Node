const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Pergunta = require("./database/Perguntas");
const Resposta = require("./database/Resposta");

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

app.get("/pergunta/:id", (req, res)=>{
  let id = req.params.id;

  Pergunta.findOne({
    where: {id: id}
  }).then(pergunta =>{
    if(pergunta != undefined){  // Pergunta encontrada
      
      Resposta.findAll({
        where: {perguntaId: pergunta.id},
        order: [
          ['id','DESC']
        ]
      }).then(respostas =>{
        res.render("pergunta",{
          pergunta: pergunta,
          respostas: respostas
        });
      });

    }else{  // Pergunta não encontrada
      res.redirect("/");
    }
  });
});

app.post("/responder", (req, res)=>{
  let corpo = req.body.corpo;
  let perguntaId = req.body.pergunta;
  
  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId
  }).then(() =>{
    res.redirect("/pergunta/"+perguntaId); // res.resdirect(2)...
  });
});

app.listen(8080, ()=>{
  console.log("App rodando");
});



/*
  Antes: <%-include partials/header.ejs%>
  Agora: <%-include ('./partials/header.ejs')%>
*/