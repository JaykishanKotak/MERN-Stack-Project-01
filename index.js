var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var User = require('./models/index.js')

//Pass the parser into middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json()); // GET data from form
mongoose.connect("mongodb://localhost:27017/Curd", {useUnifiedTopology : true, useNewUrlParser : true});

var connection = mongoose.connection;

connection.once('open', ()=>{
    console.log("Connected");
})
app.set('view engine', 'ejs')
app.get('/', (req,res) => {
    res.render('insert');
})

// Route for Insert the Data 
app.post('/insert', (req, res)=> {
    var user = new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    })

    user.save(() => {
        res.send("<h1>Data send.....</h1>");
    })
});

// Route for Show the Data  
app.get('/show', (req,res) => {
    User.find({}, (err,result)=> {
        res.render('show',{users:result});


    })
})

// Route For Delete the Data
app.get('/delete/:id', async (req,res) => {
   await User.findByIdAndDelete(req.params.id);

   res.redirect('/show');
});

//Route for Edit the Data
app.get('/edit/:id', async (req,res) => {
 
    User.findById(req.params.id, (err,result)=> {

    res.render('edit',{users:result});

   })
 });
 
//Route for Update the Data
app.post('/update/:id', async (req,res) =>{

    await User.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/show');

})
var server = app.listen(4000, ()=> {
    console.log(`Go to port number 4000`);
})