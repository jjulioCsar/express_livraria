import conn from "../config/conn.js";
import { v4 as uuidv4 } from "uuid";

export const getCliente = (req, res) => {
    const sql = /*sql*/ `SELECT * FROM Clientes`;

    conn.query(sql, (err, data) => {
        if (err) {
            res.status(500).json({ msg: "Erro ao buscar cliente" });
            return console.log(err);
        }
        const cliente = data;
        console.log(data);
        console.log(typeof data);
        res.status(200).json(cliente);
    });
};

export const cadastrarCliente = (req, res) => {
    const {nome, email, senha, imagem} = req.body;

    //validações
    if(!nome){
        return res.status(400).json({msg: "O nome é obrigatorio"});
    }
    if(!email){
        return res.status(400).json({msg: "O email é obrigatorio"});
    }
    if(!senha){
        return res.status(400).json({msg: "A senha é obrigatoria"});
    }
    if(!imagem){
        return res.status(400).json({msg: "A imagem é obrigatoria"});
    }

    //cadastrar um cliente -> antes preciso saber se esse funcionario existe
    const checkSql = /*sql*/ `SELECT * FROM Clientes WHERE nome = "${nome}" AND email = "${email}" AND senha = "${senha}"`;
    
    conn.query(checkSql, (err, data) =>{
        if (err) {
            res.status(500).json({msg: "Erro ao buscar o cliente"});
            returClienteog(err);
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

export const buscarCliente = (req, res) => {
    const { id } = req.params;

    const sql = `SELECT * FROM Clientes WHERE id = ?`;
    conn.query(sql, [id], (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ msg: "Erro ao buscar o Clientes" });
            return;
        }

        if (data.length === 0) {
            res.status(404).json({ msg: "Cliente não encontrado" });
            return;
        }
        
        const cliente = data[0]
        res.status(200).json(cliente);
    });
};

export const editarCliente = (req, res) => {
    const { id } = req.params;
        const { nome, email, senha, imagem } = req.body;
    
        //validações
        if (!nome) {
            return res.status(400).json({ msg: "O nome é obrigatório" });
        }
        if (!email) {
            return res.status(400).json({ msg: "O email é obrigatório" });
        }
        if (!senha) {
            return res.status(400).json({ msg: "A senha é obrigatória" });
        }
        if (!imagem) {
            return res.status(400).json({ msg: "A imagem é obrigatória" });
        }
        
    
        const checkSql = `SELECT * FROM Clientes WHERE id = "${id}"`;
        conn.query(checkSql, (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ msg: "Erro ao buscar clientes" });
            }
    
            if (data.length === 0) {
                return res.status(404).json({ msg: "Cliente não encontrado" });
            }
    
            // Consulta SQL para atualizar cliente
            const updateSql = `UPDATE Clientes SET 
                nome = "${nome}", email = "${email}", senha = "${senha}", imagem = "${imagem}"
                WHERE id = "${id}"`;
    
            conn.query(updateSql, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ msg: "Erro ao atualizar cliente" });
                }
                res.status(200).json({ msg: "Cliente atualizado" });
            });
        });
};

export const deletarCliente = (req, res) => {
    const {id} = req.params;
    
        const deleteSql = /*sql*/ `DELETE FROM Clientes WHERE id = ?`
        conn.query(deleteSql, [id], (err, info)=>{
            if(err){
                res.status().json({msg:"Erro ao encontrar o cliente"})
                return
            }
            if(info.affectedRows === 0){
                res.status(404).json({msg: "Erro ao deletar o cliente escolhido"})
                return
            }
            res.status(200).json({msg:"Cliente deletado com sucesso"})
        })
};
