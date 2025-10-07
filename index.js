import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import baidang from './routes/baidang.route.js';
import nguoidung from './routes/nguoidung.route.js';

const app = express()
dotenv.config()

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from cookbyingredient hehe')
});

app.use('/images', express.static('images'));

app.use('/api/baidang', baidang);
app.use('/api/nguoidung', nguoidung);

console.log("URI:", process.env.MONGODB_URI || process.env.MONGO_URI);
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("Connected to database!")
    app.listen(3000, () => {
        console.log('Server is running on port 3000')
    });
})
.catch(() => {
    console.log("Connection failed!")
});