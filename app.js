//require modules 
const express = require ('express');
const morgan  = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const itemRoutes = require('./routes/itemRoutes');
const userRoutes = require('./routes/userRoutes');
const offerRoutes = require('./routes/offerRoutes');

//create app 
const app = express();
//configure app 

let port = 3000; 
let host = 'localhost';
let url = 'mongodb+srv://sramdial:games123@cluster0.bwrkmi3.mongodb.net/nbda-project3'
app.set('view engine', 'ejs');

//connect to MongoDB
mongoose.connect(url)
.then(() => {
    //start the server
    app.listen(port,host, ()=>{
        console.log('Server is running on port ', port);
    });

})
.catch(err => console.log(err.message));

//mount middleware 
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

app.use(session({
    secret: 'jiaru90aeur90ef93oioefe',
    resave: false, 
    saveUninitialized: false,
    cookie: {maxAge: 60*60*1000},
    store: new MongoStore({mongoUrl: url})
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.session.user||null;
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
});

//set up routes 
app.get('/', (req, res) =>{
    res.render('index');
});

app.use('/items', itemRoutes);

app.use('/users', userRoutes);

app.use('/offers', offerRoutes);

app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404; 
    next(err);
});

app.use((err, req, res, next) => {
    if(!err.status){
        console.log(err.message);
        err.status = 500; 
        err.message = ("Internal Server Error");
    }

    res.status(err.status);
    res.render('error', {error: err});

});