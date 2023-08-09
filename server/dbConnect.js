const mongoose = require('mongoose')

module.exports = async () => {
    const mongoUri = 'mongodb+srv://shanti7482:Hko6GZzQm1sVK9DE@cluster0.jjfa6ui.mongodb.net/?retryWrites=true&w=majority'
    try {
        const connect = await mongoose.connect(
            mongoUri,
            // {
            //     userUnifiedTopology: true,
            //     userNewUrlParser: true
            // }
        )

        // console.log(`mongoDB connected: ${connect.connection.host}`)
        console.log(`MongoDB Connected....`);

    } catch (error) {
        console.log(error)
        process.exit(1);
    }

}