const express= require('express');
const router= express.Router();
const {User}= require('../models/User');
const {Host}= require('../models/Host');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-handlebars');
const moment= require('moment');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;



const isAuthenticated= (req,res,next)=> {
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash('error',`You need to login first.`);
        res.redirect('/host_login');
    }
}

const isNotAuthenticated= (req,res,next)=> {
    if(! req.isAuthenticated()){
        next();
    }else{
        req.flash('error',`You need to logout first.`);
        res.redirect('/users');
    }
}




router.get('/',isNotAuthenticated, (req,res)=> {
    res.render('checkin');
})


router.get('/host_register',isNotAuthenticated, (req,res)=> {
    res.render('host_register');
})


router.get('/host_login', isNotAuthenticated, (req,res)=> {
    res.render('host_login');
})


router.get('/users',isAuthenticated,(req,res)=> {  
    User.find().then((users)=> {
        res.render('users',{users});
    })
})


router.post('/checkin',(req,res)=> {
    
    console.log(req.body);
    
    let errors=[];
    
    if(!req.body.name){
        errors.push({message:'Enter name'});
    }
    if(!req.body.email){
        errors.push({message:'Enter email'});
    }
    if(!req.body.phone){
        errors.push({message:'Enter contact no.'});
    }
    
    
    if(errors.length>0){
        res.render('checkin',{errors});
    }
    else{   
        User.findOne({ email: req.body.email}).then((user)=> {
            if(user){
               let errors=[];
               errors.push({message:'A user with this email is already checked-in'});
               res.render('checkin',{errors});
            }
            else{
                const user= new User({
                        name:req.body.name,
                        email:req.body.email,
                        phone:req.body.phone,
                        checkin:moment().format('LT'),
                        checkout:"not checked-out",
                        timestamp:moment().format('LT')
                    });
                
                Host.findOne().then((host)=> {
                    
                    
                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            
                            user: 'put your email here, to send emails to host and user', 
                            pass: 'your password'
                            
                        }
                    });


                    let mailOptions = {
                        
                        from: 'put your email here, to send emails to host and user',
                        
                        to: host.email,
                        subject: 'A User Checked-in',
                        html: `<div><p>User ${req.body.name} Checked-in</p>
                                    <p>Email: ${req.body.email}</p>
                                    <p>Phone: ${req.body.phone}</p>
                                    <p>Checkin Time: ${moment().format('LT')}</p>
                                    <p>Checkout Time: "not checked-out"</p>
                              </div>`
                    };


                    transporter.sendMail(mailOptions)
                        .then(response=> {
                             console.log("Email Sent");
                         }).catch(err=> {
                              console.log("Error occured",err);
                    })         
                })
                
                user.save().then(()=> {
                    req.flash('success_message',`User ${req.body.name} checked-in`);
                    res.redirect('/');
                });        
            }
        })   
    }   
    
})


router.delete('/users/:id',isAuthenticated,(req,res)=> {
    
     User.findById(req.params.id).then((user)=> {
         
        user.remove();
                   
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                
                user: 'put your email here, to send emails to host and user', 
                pass: 'your password'
                
            }
        });

        let mailOptions = {
            
            from: 'put your email here, to send emails to host and user',
            
            to: user.email,
            subject: 'You Checked-out',
            html: `<div><p>You (${user.name}) Checked-out</p>
                        <p>Email: ${user.email}</p>
                        <p>Phone: ${user.phone}</p>
                        <p>Checkin Time: ${user.checkin}</p>
                        <p>Checkout Time: ${moment().format('LT')}</p>
                  </div>`
        };

        transporter.sendMail(mailOptions)
            .then(response=> {
                 console.log("Email Sent");
             }).catch(err=> {
                  console.log("Error occured",err);
        })

        req.flash('success_message',`User ${user.name} checked-out`);
        res.redirect('/users');
         
    })
    
})




router.post('/host_register',(req,res)=> {
    
    let errors=[];
    
    if(!req.body.name){
        errors.push({message:'Enter name'});
    }
    if(!req.body.email){
        errors.push({message:'Enter email'});
    }
    if(!req.body.password){
        errors.push({message:'Enter password'});
    }
    
    
    if(errors.length>0){
        res.render('host_register',{errors});
    }
    else{   
        Host.findOne().then((host)=> {
            if(host){
               let errors=[];
               errors.push({message:'A host is already registered'});
               res.render('host_register',{errors});
            }
            else{  
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(req.body.password, salt, function(err, hash) {

                        const host= new Host({
                            name:req.body.name,
                            email:req.body.email,
                            password:hash
                        });

                        host.save().then(()=> {
                            req.flash('success_message',`You're registered as the host`);
                            res.redirect('/host_login');
                        });      
                    });
                });            
            }
        })   
    }      
})




passport.use(new LocalStrategy({usernameField: 'email'},
  (email, password, done)=> {
    
    Host.findOne({email:email}).then((host)=> {
        
      if (!host) {
        return done(null, false);
      }
        
        bcrypt.compare(password, host.password,(err, matched)=> {
            
                if(matched){
                    return done(null, host);
                }
                else{
                    return done(null, false);
                }
        });
    })
   }
));


passport.serializeUser(function(host, done) {
  done(null, host.id);
});
passport.deserializeUser(function(id, done) {
  Host.findById(id, function(err, host) {
    done(err, host);
  });
});



router.post('/host_login',
  passport.authenticate('local'
                        , {successRedirect: '/users',
                          failureRedirect: '/host_login',
                          failureFlash: 'Invalid username or password.',
                          successFlash: 'Welcome!'}
                       ));



router.get('/host_logout',isAuthenticated,(req, res)=>{
  req.logout();
  res.redirect('/host_login');
});




module.exports= router;
