
const express = require('express');
const dotenv = require('dotenv');
dotenv.config('./.env');
const dbConnect = require("./dbConnect")
const morgan = require('morgan');
const authRouter = require('./routers/authRouter');
const postRouter = require('./routers/postRouter');
const userRouter = require('./routers/userRouter')
const cookiesParser = require('cookie-parser')
const cors = require('cors')
const cloudinary = require('cloudinary').v2;


//Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY
});

const app = express();

//middleware //install the morgan middleware 
app.use(express.json({ limit: '10mb' })) //this is use for body.parser
// app.use(morgan(common))       //ye log generate karta hai
app.use(cookiesParser())
// app.use(express.urlencoded({
//     extented: true,
// }));
let origin = 'http://localhost:3000';
if (process.env.NODE_ENV === 'production') {
    origin = process.env.CORS_ORIGIN
}
app.use(
    cors({
        credentials: true,
        origin //dusre server ka port no || yaha array v pass kar sakte hai different different server ka
    }))



//router
app.use('/auth', authRouter)
app.use('/posts', postRouter);
app.use('/user', userRouter);


app.get('/', (req, res) => {
    res.status(200).send('OK From Server')
}
)

dbConnect();
const PORT = process.env.PORT || 4000;
app.listen(PORT, (err) => {
    console.log(`Server start on port no. ${PORT}`);
})


// ASDfNX3mec3jALs0