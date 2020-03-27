const express = require('express');
const path=require('path');
const exphbs = require('express-handlebars');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride =require('method-override');
const flash=require('connect-flash');
const session=require('express-session');
const router=express.Router();
const passport=require('passport');


//load routes
const ideas=require('./routes/ideas');
const users=require('./routes/users');

//pasport config
require('./config/passport')(passport);

//db config
const db=require('./config/database');


//connect t mongoose
// mongoose.connect('mongodb://localhost/vidjot-dev',{useNewUrlParser: true})
// .then(()=>console.log('mongo connected'))
// .catch(err => console.log(err));
mongoose.Promise = global.Promise;


mongoose.connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var dbs = mongoose.connection;
dbs.on('error', console.error.bind(console, 'monogdb connection error'));

//static folder
app.use(express.static(path.join(__dirname,'public')));

//handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//body parser mmiddleware
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());

//methodoverride middleware
app.use(methodOverride('_method'));


//express-sessions middleware
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));


//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash middleware
app.use(flash());

//global variables
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    res.locals.user=req.user || null ;
    next();
});




//index route
app.get('/', (req, res) => {
    const title = 'welcome';
    res.render('index', {
        title: title
    });
});





//about route
app.get('/about', (req, res) => {
    res.render('about');
});


//user routes
app.use('/users',users);
//idea routes
app.use('/ideas',ideas);


const port = process.env.PORT || 5000;

app.listen(port, () => { 
    console.log(`server started on port ${port}`);
});