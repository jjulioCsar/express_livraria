import conn from "../config/conn.js";

const tableClientes = /*sql*/ `
    create table if not exists Clientes(
id varchar(60) primary key,
nome varchar(255) not null,
email varchar(255) not null,
senha varchar(8) not null,
imagem varchar(3000) not null,
created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp on update current_timestamp
    );
`;

conn.query(tableClientes, (err) =>{
    if(err){
        console.error("Erro ao criar a tabela"+err.stack)
        return
    }
    console.log("Tabela [clientes] criada com sucesso!")
})