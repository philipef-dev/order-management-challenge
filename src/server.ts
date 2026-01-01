import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routes from './routes.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use(routes);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/linkio_challenge'

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Conectado ao MongoDB com sucesso!');
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http:localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Erro ao conectar o MongoDB', err)
    })