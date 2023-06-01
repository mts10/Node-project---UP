//configuracao inicial
// Não me resposabilizo por qualquer irritação de usabilidade dessa gambiarra abaixo.
const express = require('express');
const mongoose = require('mongoose');
const uploadRouter = require('./upload'); // Caminho para o arquivo upload.js
const app = express();

const Person = require('./models/Person')

//Ler json - Middlewares
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

// Rota para excluir usuário pelo código
const deleteUserByCode = require('./routes/deleteUserByCode');
app.use('/person/delete', deleteUserByCode);

//Rota para editar status e imagem do usuario por codigo
const editUserRoutes = require('./routes/editUser');
app.use('/person/edit', editUserRoutes);

//Rotas da API - Cadastrar usuario
app.post('/person', async (req,res)=>{
    // req.body
    const {nome, sobrenome, dataNasc, endereco, codigo, telefone, cidade, estado, status} = req.body
    
    if(!nome, !sobrenome, !dataNasc, !codigo, !endereco, !telefone, !cidade, !estado, !status){
        res.status(422).json({error: 'Não foi possível validar as informações de cadastro'})
    }

    const person = {
        nome, 
        sobrenome,
        dataNasc,
        endereco,
        codigo,
        telefone,
        cidade,
        estado, 
        status
    }

    try {
        //criando dados pessoas
        await Person.create(person)

        res.status(201).json({message: 'Pessoa inserida no sistema com sucesso'})

    } catch (error) {
        res.status(500).json({error: error})
    }

/*
    O modelod de JSON que deve ser passado para cadastrar o usuario está abaixo:

    {
    "nome": "Arthur Felipe", 
    "sobrenome":"Rech",
    "dataNasc":"23/12/2003",
    "endereco":"Rua xxx N tal",
    "codigo":"Podes colocar qualquer string, será gerado automaticamente com o prefixo COD1+",
    "telefone":"+55 41 987324554",
    "cidade":"São José dos Pinhais",
    "estado":"Paraná", 
    "status":"true"
    }

*/
    
})

//Para Cadastrar a imagem via PostMan
//Selecionar o método POST
//utilizar a rota: http://localhost:3000/upload-profile-image
//selecionar a opcao - Body -> Form Data
//Inserir a Key: profileImage, marcar a opção File, no canto direito de profileImage
//Inserir a imagem desejada no campo "Value"
//Enviar a requisição
app.use(uploadRouter)




//Neste projeto utilizei o Atlas como gerenciador do Banco de dados
// Essas configuracoes sao responsaveis por manter a conexao com o banco, para testar essa api
// deve-se criar uma conta no Atlas e cadastrar com seu usuario e senha do projeto
// assim poderá testar a API 100%
const DB_USER = 'arthurrechconsultoria'
const DB_PASSWORD = encodeURIComponent('positivoOsorio')
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@apiclusterpositivo.2bo7ipw.mongodb.net/bancodaapi?retryWrites=true&w=majority`)
.then(()=> {
    console.log("Conectamos ao Banco")
    app.listen(3000)
})
.catch((err) =>console.log(err))


