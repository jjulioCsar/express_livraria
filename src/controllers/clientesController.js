import conn from "../config/conn.js";
import { v4 as uuidv4 } from "uuid";

export const getCliente = (req, res) => {
    const sql = `SELECT * FROM Clientes`;

    conn.query(sql, (err, data) => {
        if (err) {
            res.status(500).json({ msg: "Erro ao buscar cliente" });
            console.log(err);
            return;
        }
        res.status(200).json(data);
    });
};

export const cadastrarCliente = (req, res) => {
    const { nome, email, senha, imagem } = req.body;

    // Validações
    if (!nome) return res.status(400).json({ msg: "O nome é obrigatório" });
    if (!email) return res.status(400).json({ msg: "O email é obrigatório" });
    if (!senha) return res.status(400).json({ msg: "A senha é obrigatória" });
    if (!imagem) return res.status(400).json({ msg: "A imagem é obrigatória" });

    // Verificar se o cliente já existe
    const checkSql = `SELECT * FROM Clientes WHERE nome = ? AND email = ? AND senha = ?`;
    const checkValues = [nome, email, senha];

    conn.query(checkSql, checkValues, (err, data) => {
        if (err) {
            res.status(500).json({ msg: "Erro ao buscar o cliente" });
            console.log(err);
            return;
        }

        if (data.length > 0) {
            res.status(409).json({ msg: "O cliente já existe no banco de dados" });
            return;
        }

        const id = uuidv4();
        const insertSQL = `INSERT INTO Clientes (cliente_id, nome, email, senha, imagem) VALUES (?, ?, ?, ?, ?)`;
        const insertValues = [id, nome, email, senha, imagem];

        conn.query(insertSQL, insertValues, (err) => {
            if (err) {
                res.status(500).json({ msg: "Erro ao cadastrar o cliente" });
                console.log(err);
                return;
            }
            res.status(200).json({ msg: "Cliente cadastrado com sucesso", id });
        });
    });
};

export const buscarCliente = (req, res) => {
    const { id } = req.params;

    const sql = `SELECT * FROM Clientes WHERE cliente_id = ?`;
    conn.query(sql, [id], (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ msg: "Erro ao buscar o cliente" });
            return;
        }

        if (data.length === 0) {
            res.status(404).json({ msg: "Cliente não encontrado" });
            return;
        }

        res.status(200).json(data[0]);
    });
};

export const editarCliente = (req, res) => {
    const { id } = req.params;
    const { nome, email, senha, imagem } = req.body;

    // Validações
    if (!nome) return res.status(400).json({ msg: "O nome é obrigatório" });
    if (!email) return res.status(400).json({ msg: "O email é obrigatório" });
    if (!senha) return res.status(400).json({ msg: "A senha é obrigatória" });
    if (!imagem) return res.status(400).json({ msg: "A imagem é obrigatória" });

    const checkSql = `SELECT * FROM Clientes WHERE cliente_id = ?`;
    conn.query(checkSql, [id], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: "Erro ao buscar clientes" });
        }

        if (data.length === 0) {
            return res.status(404).json({ msg: "Cliente não encontrado" });
        }

        // Consulta SQL para atualizar cliente
        const updateSql = `UPDATE Clientes SET nome = ?, email = ?, senha = ?, imagem = ? WHERE cliente_id = ?`;
        const updateValues = [nome, email, senha, imagem, id];

        conn.query(updateSql, updateValues, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ msg: "Erro ao atualizar cliente" });
            }
            res.status(200).json({ msg: "Cliente atualizado com sucesso" });
        });
    });
};

export const deletarCliente = (req, res) => {
    const { id } = req.params;

    const deleteSql = `DELETE FROM Clientes WHERE cliente_id = ?`;
    conn.query(deleteSql, [id], (err, info) => {
        if (err) {
            res.status(500).json({ msg: "Erro ao deletar o cliente" });
            return;
        }
        if (info.affectedRows === 0) {
            res.status(404).json({ msg: "Cliente não encontrado" });
            return;
        }
        res.status(200).json({ msg: "Cliente deletado com sucesso" });
    });
};
