import conn from "../config/conn.js";

const tableLivros = /*sql*/ `
    create table if not exists Livros(
livro_id varchar(60) primary key,
titulo varchar(255) not null,
autor varchar(255) not null,
ano_publicacao year(4) not null,
genero varchar(255) not null,
preco decimal(10, 2) not null,
disponibilidade boolean,
created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp on update current_timestamp
    );
`;

conn.query(tableLivros, (err) =>{
    if(err){
        console.error("Erro ao criar a tabela"+err.stack)
        return
    }
    console.log("Tabela [livros] criada com sucesso!")
})
