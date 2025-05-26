import express from 'express';
import pgclient from '../db.js';

const bookRoutes = express.Router();

// get all users
// localhost:3001/api/books/
bookRoutes.get('/', async (req, res) => {
    const books = await pgclient.query("SELECT * FROM books;");
    res.json(books.rows);
})

// localhost:3001/api/books/2

bookRoutes.get('/:id', async (req, res) => {
    const result = await pgclient.query("SELECT * FROM books WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
        res.status(404).json({ message: "book not found" });
    }
    res.json(result.rows[0]);
})

//add book
bookRoutes.post('/', async (req,res) => {
    const {title, author, year} = req.body;
    const result = await pgclient.query("INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING *", [title, author, year]);
    res.status(201).json(result.rows);
})

bookRoutes.put("/:id", async (req, res) => {
  const { title, author, year } = req.body;
  try {
    const result = await pgclient.query(
      "UPDATE books SET title = $1, author = $2, year = $3 WHERE id = $4 RETURNING *",[title, author, year, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "book not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

bookRoutes.delete("/:id", async (req, res) => {
  try {
    const result = await pgclient.query("DELETE FROM books WHERE id = $1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "book not found" });
    }
    res.json({ message: "book deleted", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default bookRoutes;