import conn from "../config/conn.js";

const tableFuncionario = /*sql*/ `
create table if not exists Funcionarios(
id varchar(60) primary key,
nome varchar(255) not null,
cargo varchar(255) not null,
data_contratacao date not null,
email varchar(255) not null,
salario varchar(255) not null,
created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp on update current_timestamp
    );
`;

conn.query(tableFuncionario, (err) =>{
    if(err){
        console.error("Erro ao criar a tabela"+err.stack)
        return
    }
    
    console.log("Tabela [funcionarios] criada com sucesso!")
})
