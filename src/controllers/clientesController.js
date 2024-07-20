import conn from "../config/conn.js";
import { v4 as uuidv4 } from "uuid";

export const getCliente = (req, res) => {
    const sql = /*sql*/ `SELECT * FROM Clientes`;

    conn.query(sql, (err, data) => {
        if (err) {
            res.status(500).json({ msg: "Erro ao buscar cliente" });
            return console.log(err);
        }
        const Cliente = data;
        console.log(data);
        console.log(typeof data);
        res.status(200).json(Cliente);
    });
};

export const cadastrarCliente = (req, res) => {
    const {nome, email, senha, imagem} = req.body;

    //validações
    if(!nome){
        return res.status(400).json({msg: "O nome é obrigatorio"});
    }
    if(!email){
        return res.status(400).json({msg: "O cargo é obrigatorio"});
    }
    if(!email){
        return res.status(400).json({msg: "O email é obrigatorio"});
    }
    if(!imagem){
        return res.status(400).json({msg: "O salario é obrigatorio"});
    }

    //cadastrar um funcionario -> antes preciso saber se esse funcionario existe
    const checkSql = /*sql*/ `SELECT * FROM Clientes WHERE nome = "${nome}" AND email = "${email}" AND senha = "${senha}"`;
    
    conn.query(checkSql, (err, data) =>{
        if (err) {
            res.status(500).json({msg: "Erro ao buscar o cliente"});
            return console.log(err);
        }

        if (data.length > 0) {
            res.status(409).json({msg: "O cliente já existe no banco de dados"});
            return console.log(err);
        }

        const id = uuidv4();

        const insertSQL = /*sql*/ `INSERT INTO Clientes
        (id, nome, email, senha, imagem)
        VALUES
        ("${id}","${nome}", "${email}", "${senha}", "${imagem}")`;

        conn.query(insertSQL, (err) => {
            if (err) {
                res.status(500).json({msg: "Erro ao cadastrar o cliente"});
                return console.log(err);
            }
            res.status(200).json({msg:"Cliente cadastrado"});
        });
    });
};

export const buscarFuncionario = (req, res) => {
    const { id } = req.params;

    const sql = `SELECT * FROM Clientes WHERE id = ?`;
    conn.query(sql, [id], (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ msg: "Erro ao buscar o Clientes" });
            return;
        }

        if (data.length === 0) {
            res.status(404).json({ msg: "Funcionario não encontrado" });
            return;
        }
        
        const funcionario = data[0]
        res.status(200).json(funcionario);
    });
};

export const editarFuncionario = (req, res) => {
    const { id } = req.params;
        const { nome, cargo, data_contratacao, email, salario } = req.body;
    
        //validações
        if (!nome) {
            return res.status(400).json({ msg: "O nome é obrigatório" });
        }
        if (!cargo) {
            return res.status(400).json({ msg: "O cargo é obrigatório" });
        }
        if (!data_contratacao) {
            return res.status(400).json({ msg: "A data de contratação é obrigatória" });
        }
        if (!email) {
            return res.status(400).json({ msg: "O email é obrigatório" });
        }
        if (!salario) {
            return res.status(400).json({ msg: "O salario é obrigatório" });
        }
    
        const checkSql = `SELECT * FROM Funcionarios WHERE id = "${id}"`;
        conn.query(checkSql, (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ msg: "Erro ao buscar funcionários" });
            }
    
            if (data.length === 0) {
                return res.status(404).json({ msg: "Funcionário não encontrado" });
            }
    
            // Consulta SQL para atualizar funcionário
            const updateSql = `UPDATE Funcionarios SET 
                nome = "${nome}", cargo = "${cargo}", data_contratacao = "${data_contratacao}", email = "${email}", salario = "${salario}"
                WHERE id = "${id}"`;
    
            conn.query(updateSql, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ msg: "Erro ao atualizar funcionário" });
                }
                res.status(200).json({ msg: "Funcionário atualizado" });
            });
        });
};

export const deletarFuncionario = (req, res) => {
    const {id} = req.params;
    
        const deleteSql = /*sql*/ `DELETE FROM Funcionarios WHERE id = ?`
        conn.query(deleteSql, [id], (err, info)=>{
            if(err){
                res.status().json({msg:"Erro ao encontrar o funcionario"})
                return
            }
            if(info.affectedRows === 0){
                res.status(404).json({msg: "Erro ao deletar o Funcionario escolhido"})
                return
            }
            res.status(200).json({msg:"Funcionario deletado com sucesso"})
        })
};
