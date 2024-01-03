var express = require("express");
var mysql = require("mysql");
var bodyParser = require('body-parser')

var app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: false })) 



var con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"contactbook",
});

con.connect();

app.get('/',function(req,res){
    res.render("index");
})
app.get('/register',function(req,res){
    res.render("register");
})
app.get('/login',function(req,res){
    res.render("login");
})


app.post('/regis',function(req,res){
    
    var email = req.body.email;
    var password = req.body.password;
    
    var insert_query ="insert into user(email,password) values ('"+email+"','"+password+"')";
    
    con.query(insert_query , function(error,result,field){
        if(error) throw error;

        var sq = "select * from contact"
        con.query(sq , function(error,result,field){
        if(error) throw error;

        res.render('table',{result});
        })
    })
});

app.get('/addcontact' , function(req,res){

    var select_query = "select * from contact";

    con.query(select_query , function(error,result,field){
        if(error) throw error;
        res.render("table",{result});
    })

});

app.post('/addcontact',function(req,res){
    
    var name = req.body.name;
    var contact = req.body.contact;
    
    var insert_query ="insert into contact(name,contact) values ('"+name+"','"+contact+"')";
    
    con.query(insert_query , function(error,result,field){
        if(error) throw error;
        res.redirect("/addcontact");
    })
});
app.get('/delete/:id' , function(req,res){

    var id = req.params.id;

    var delete_query = "delete from contact where id = " + id;

    con.query(delete_query , function(error,result,field){
        if(error) throw error;
        res.redirect('/addcontact');
    })
});

app.post('/up/:id' , function(req,res){

    var id = req.body.id;
    var id = req.params.id;

    var update_query = "update contact set name = '"+req.body.name+"', contact = '"+req.body.contact+"' where id = '"+id+"' ";

    console.log(id);

    con.query(update_query , function(error,result,field){
        if(error) throw error;
        res.redirect("/addcontact");
    })
});



app.get('/up/:id' , function(req,res){
    var id  = req.params.id;

    var  edit_query = "select * from contact where id = " +id; 

    con.query(edit_query, function (error, result, field) {
        if (error) throw error;
        res.render("form",{result});
        
    })
});
app.post('/loginuser' , function(req,res){

    var  sq = "select * from user where email='"+req.body.email+"' and password='"+req.body.password+"'"; 

    con.query(sq, function (error, result, field) {
        if (error) throw error;

        var rescount = result.length;

        if(rescount>0){
            res.render("table",{result})
        }
        else{
            res.send("invalid");
        }
        
    })
});
app.get('/login' , function(req,res){
    res.render("login");
});



app.listen(3000);