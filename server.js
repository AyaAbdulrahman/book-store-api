import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pgclient from './db.js';
import bookRoutes from './routes/book.js';

const app = express();
dotenv.config(); 

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// Port setup
const PORT = process.env.PORT || 3002;

// Routes
app.use('/api/books', bookRoutes);

app.get('/', (req, res) => {
  res.send('home route');
})

// Test route
app.get('/test', (req, res) => {
  res.send('test route response');
})

// 404 handler
app.use((req,res) => {
    res.json({ message: "route not found" });
});

pgclient.connect()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`listening on ${PORT}`);              
            });
        }).catch((error) =>{
            console.log('error connecting to pg server');
        })
        