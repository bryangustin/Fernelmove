const mongoose = require("mongoose");

// mongoose.connect(process.env.MONGODB_URL, {
//     useNewUrlParser: true, 
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false
// })

const path = require('path');
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname,'./public');
const viewsPath = path.join(__dirname, './template/views');

const express = require('express');
const app = express();
const mainRouter = require('./function/mainRoute')
const expressEjsLayout = require('express-ejs-layouts');

///// EJS /////
app.set('view engine','ejs');
app.use(expressEjsLayout);

app.set('views', viewsPath);
app.use(express.static(publicDirectoryPath));
app.set('layout', '../layout');

mainRouter(app, '/', 'index');

app.listen(port, () => {
    console.log(`Server up on port ${port}`);
});