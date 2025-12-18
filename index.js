import 'dotenv/config';

import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import baidang from './routes/baidang.route.js';
import nguoidung from './routes/nguoidung.route.js';
import image from "./routes/image.routes.js";
import recommendRoute from "./routes/recommend.route.js";
import reel from './routes/reel.route.js';
import comment from './routes/comment.route.js';

const app = express();

app.use(express.json({ limit: "10mb"}));
app.use("/video", express.static(path.resolve("video")));

app.get('/', (req, res) => {
    res.send('Hello from cookbyingredient hehe')
});

app.use('/images', express.static('images'));
app.use('/api/baidang', baidang);
app.use('/api/nguoidung', nguoidung);
app.use("/api/image", image);
app.use("/api/recommend", recommendRoute);
app.use("/api/reel", reel);
app.use("/api/comment", comment);

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