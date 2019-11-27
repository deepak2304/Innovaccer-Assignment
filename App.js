const express= require('express');
const mongoose= require('mongoose');
const bodyParser= require('body-parser');
const exphbs= require('express-handlebars');
const path= require('path');
const methodOverride= require('method-override');
const session= require('express-session');
const flash= require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;



//Load Routes
const index= require('./routes/index');

const app= express();
const port= process.env.PORT || 8000;

mongoose.Promise= global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/innovaccer',{ useNewUrlParser: true, useUnifiedTopology: true });


//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


//View engine-----defaultLayout:home
app.engine('handlebars', exphbs({defaultLayout:'home'}));
app.set('view engine', 'handlebars');


//method-override
app.use(methodOverride('_method'));


//session-middleware
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'deepakkumrawat8@gmail.com',
  resave: true,
  saveUninitialized: true
}))


//flash-middleware
app.use(flash());
app.use((req,res,next)=> {
    res.locals.user= req.user || null;
    res.locals.success_message=req.flash('success_message');
    res.locals.error=req.flash('error');
    res.locals.success=req.flash('success');
    next();
});


//passport.js-middleware
app.use(passport.initialize());
app.use(passport.session());


//Use routes
app.use('/',index);


app.listen(port,()=> {
    console.log(`Started on port ${port}`);
})
