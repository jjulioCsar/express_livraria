import conn from "../config/conn.js";
import { v4 as uuidv4 } from "uuid";

export const getLivros = (req, res) => {
  const sql = `SELECT * FROM livros`;
  conn.query(sql, (err, data) => {
    if (err) {
      res.status(500).json({ message: "Erro ao buscar livros" });
      return;
    }
    res.status(200).json(data);
  });
};

export const cadastrarLivros = (req, res) => {
  const { titulo, autor, ano_publicacao, genero, preco, disponibilidade } = req.body;

  if (!titulo || !autor || !ano_publicacao || !genero || !preco || disponibilidade === undefined) {
    return res.status(400).json({
      msg: "Todos os campos são obrigatórios, incluindo disponibilidade",
    });
  }

  const id = uuidv4();
  const sql = `
    INSERT INTO livros (Livro_id, titulo, autor, ano_publicacao, genero, preco, disponibilidade)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [id, titulo, autor, ano_publicacao, genero, preco, disponibilidade];

  conn.query(sql, values, (err) => {
    if (err) {
      res.status(500).json({ message: "Erro ao cadastrar livro" });
      return;
    }
    res.status(201).json({ message: "Livro cadastrado com sucesso", id });
  });
};

export const buscarLivro = (req, res) => {
  const { id } = req.params;

  const sql = `SELECT * FROM livros WHERE Livro_id = ?`;
  conn.query(sql, [id], (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ msg: "Erro ao buscar o livro" });
      return;
    }

    if (data.length === 0) {
      res.status(404).json({ msg: "Livro não encontrado" });
      return;
    }

    res.status(200).json(data[0]);
  });
};

export const editarLivro = (req, res) => {
  const { id } = req.params;
  const { titulo, autor, ano_publicacao, genero, preco, disponibilidade } = req.body;

  // Validações
  if (!titulo) return res.status(400).json({ msg: "O título é obrigatório" });
  if (!autor) return res.status(400).json({ msg: "O autor é obrigatório" });
  if (!ano_publicacao) return res.status(400).json({ msg: "O ano de publicação é obrigatório" });
  if (!genero) return res.status(400).json({ msg: "O gênero é obrigatório" });
  if (!preco) return res.status(400).json({ msg: "O preço é obrigatório" });
  if (disponibilidade === undefined) return res.status(400).json({ msg: "A disponibilidade é obrigatória" });

  const checkSql = `SELECT * FROM livros WHERE Livro_id = ?`;
  conn.query(checkSql, [id], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: "Erro ao buscar livros" });
    }

    if (data.length === 0) {
      return res.status(404).json({ msg: "Livro não encontrado" });
    }

    // Consulta SQL para atualizar livro
    const updateSql = `
      UPDATE livros SET 
      titulo = ?, autor = ?, ano_publicacao = ?, genero = ?, preco = ?, disponibilidade = ?
      WHERE Livro_id = ?
    `;
    const values = [titulo, autor, ano_publicacao, genero, preco, disponibilidade, id];

    conn.query(updateSql, values, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: "Erro ao atualizar livro" });
      }
      res.status(200).json({ msg: "Livro atualizado com sucesso" });
    });
  });
};

export const deletarLivro = (req, res) => {
  const { id } = req.params;

  const deleteSql = `DELETE FROM livros WHERE Livro_id = ?`;
  conn.query(deleteSql, [id], (err, info) => {
    if (err) {
      res.status(500).json({ msg: "Erro ao deletar o livro" });
      return;
    }
    if (info.affectedRows === 0) {
      res.status(404).json({ msg: "Livro não encontrado" });
      return;
    }
    res.status(200).json({ msg: "Livro deletado com sucesso" });
  });
};
