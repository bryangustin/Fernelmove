const mongoose = require("mongoose");
const path = require('path');
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname,'./public');
const viewsPath = path.join(__dirname, './template/views');
const passport = require('passport');
const session = require('express-session');
const express = require('express');
const app = express();

const mainRouter = require('./function/mainRoute');
const postRouter = require('./function/postRoute');
const commentaireRouter = require('./function/commentaireRoute');

const expressEjsLayout = require('express-ejs-layouts');
const flash = require('connect-flash');
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
dotenv.config();



///// BodyParser /////
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
app.use(express.static(publicDirectoryPath));  //CSS + JS
app.set('layout', '../layout');

///// express session /////
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}));

///// Passport /////
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

///// use flash /////
app.use(flash());
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error  = req.flash('error');
    next();
});

///// GET Routes /////
mainRouter(app, '/', 'index');
mainRouter(app, '/password', 'password');
mainRouter(app, '/resetPassword/:token', 'resetPassword', 'reset');
mainRouter(app, '/users/login', 'login');
mainRouter(app, '/users/register', 'register');
mainRouter(app, '/users/my-account', 'my-account', 
// 'logged'
);
mainRouter(app, '/commentaire', 'commentaire');
mainRouter(app, '/activity', 'activity');
mainRouter(app, '/quiz', 'quiz');
mainRouter(app, '/map', 'map');


///// POST Routes /////
postRouter(app);
commentaireRouter(app);



app.listen(port, () => {
    console.log(`Server up on port ${port}`);
});



