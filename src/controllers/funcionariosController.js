import conn from "../config/conn.js";
import { v4 as uuidv4 } from "uuid";

export const getFuncionarios = (req, res) => {
    const sql = `SELECT * FROM funcionarios`;

    conn.query(sql, (err, data) => {
        if (err) {
            res.status(500).json({ msg: "Erro ao buscar funcionarios" });
            console.log(err);
            return;
        }
        res.status(200).json(data);
    });
};

export const cadastrarFuncionario = (req, res) => {
    const { nome, cargo, data_contratacao, email, salario } = req.body;

    // Validações
    if (!nome) return res.status(400).json({ msg: "O nome é obrigatório" });
    if (!cargo) return res.status(400).json({ msg: "O cargo é obrigatório" });
    if (!data_contratacao) return res.status(400).json({ msg: "A data de contratação é obrigatória" });
    if (!email) return res.status(400).json({ msg: "O email é obrigatório" });
    if (!salario) return res.status(400).json({ msg: "O salario é obrigatório" });

    // Verificar se o funcionário já existe
    const checkSql = `SELECT * FROM funcionarios WHERE nome = ? AND cargo = ? AND data_contratacao = ?`;
    const checkValues = [nome, cargo, data_contratacao];

    conn.query(checkSql, checkValues, (err, data) => {
        if (err) {
            res.status(500).json({ msg: "Erro ao buscar o funcionario" });
            console.log(err);
            return;
        }

        if (data.length > 0) {
            res.status(409).json({ msg: "O funcionario já existe no banco de dados" });
            return;
        }

        const id = uuidv4();
        const insertSQL = `INSERT INTO funcionarios (funcionario_id, nome, cargo, data_contratacao, email, salario) VALUES (?, ?, ?, ?, ?, ?)`;
        const insertValues = [id, nome, cargo, data_contratacao, email, salario];

        conn.query(insertSQL, insertValues, (err) => {
            if (err) {
                res.status(500).json({ msg: "Erro ao cadastrar o funcionario" });
                console.log(err);
                return;
            }
            res.status(200).json({ msg: "Funcionario cadastrado com sucesso", id });
        });
    });
};

export const buscarFuncionario = (req, res) => {
    const { id } = req.params;

    const sql = `SELECT * FROM funcionarios WHERE funcionario_id = ?`;
    conn.query(sql, [id], (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ msg: "Erro ao buscar o funcionario" });
            return;
        }

        if (data.length === 0) {
            res.status(404).json({ msg: "Funcionario não encontrado" });
            return;
        }

        res.status(200).json(data[0]);
    });
};

export const editarFuncionario = (req, res) => {
    const { id } = req.params;
    const { nome, cargo, data_contratacao, email, salario } = req.body;

    // Validações
    if (!nome) return res.status(400).json({ msg: "O nome é obrigatório" });
    if (!cargo) return res.status(400).json({ msg: "O cargo é obrigatório" });
    if (!data_contratacao) return res.status(400).json({ msg: "A data de contratação é obrigatória" });
    if (!email) return res.status(400).json({ msg: "O email é obrigatório" });
    if (!salario) return res.status(400).json({ msg: "O salario é obrigatório" });

    const checkSql = `SELECT * FROM funcionarios WHERE funcionario_id = ?`;
    conn.query(checkSql, [id], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: "Erro ao buscar funcionarios" });
        }

        if (data.length === 0) {
            return res.status(404).json({ msg: "Funcionario não encontrado" });
        }

        // Consulta SQL para atualizar funcionário
        const updateSql = `UPDATE funcionarios SET nome = ?, cargo = ?, data_contratacao = ?, email = ?, salario = ? WHERE funcionario_id = ?`;
        const updateValues = [nome, cargo, data_contratacao, email, salario, id];

        conn.query(updateSql, updateValues, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ msg: "Erro ao atualizar funcionario" });
            }
            res.status(200).json({ msg: "Funcionario atualizado com sucesso" });
        });
    });
};

export const deletarFuncionario = (req, res) => {
    const { id } = req.params;

    const deleteSql = `DELETE FROM funcionarios WHERE funcionario_id = ?`;
    conn.query(deleteSql, [id], (err, info) => {
        if (err) {
            res.status(500).json({ msg: "Erro ao deletar o funcionario" });
            return;
        }
        if (info.affectedRows === 0) {
            res.status(404).json({ msg: "Funcionario não encontrado" });
            return;
        }
        res.status(200).json({ msg: "Funcionario deletado com sucesso" });
    });
};
