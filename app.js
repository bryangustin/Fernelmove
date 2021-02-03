const mongoose = require("mongoose");
const path = require('path');
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname,'./public');
const viewsPath = path.join(__dirname, './template/views');
const passport = require('passport');
const express = require('express');
const app = express();
const mainRouter = require('./function/mainRoute');
const postRouter = require('./function/postRoute');
const expressEjsLayout = require('express-ejs-layouts');
const dotenv = require("dotenv");

dotenv.config();

///// BodyParser /////
app.use(express.urlencoded({extended : false}));

///// Mongoose /////
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => console.log('connected to DB'))
.catch((err)=> console.log(err));

///// EJS /////
app.set('view engine','ejs');
app.use(expressEjsLayout);

app.set('views', viewsPath);
app.use(express.static(publicDirectoryPath));
app.set('layout', '../layout');

///// Passport /////
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

///// GET Routes /////
mainRouter(app, '/', 'index');
mainRouter(app, '/users/login', 'login');
mainRouter(app, '/users/register', 'register');

///// POST Routes /////
postRouter(app);


app.listen(port, () => {
    console.log(`Server up on port ${port}`);
});