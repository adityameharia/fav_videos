const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const {ensureAuthenticated}=require('../helpers/auth');


require('../models/Idea');
const Idea = mongoose.model('ideas');

//idea page
router.get('/',ensureAuthenticated, (req, res) => {
    Idea.find({user:req.user.id}).sort({ date: 'desc' })
        .then((ideas) => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});

//add idea form
router.get('/add',ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

//edit idea form
router.get('/edit/:id',ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    }).then((idea) => {
        if(idea.user!=req.user.id){
            req.flash('error_msg','u are not auhtorized to visit this page');
            res.redirect('/ideas');
        }
        res.render('ideas/edit', {
            idea:idea
        });
    });
});

//process form
router.post('/',ensureAuthenticated, (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({ text: 'please enter a title' });
    }
    if (!req.body.details) {
        errors.push({ text: 'pls enter some details' });
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors,
            title: req.body.title,
            details: req.body.details
        });
    }
    else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user:req.user.id
        }
        new Idea(newUser).save()
            .then(() => {
                req.flash('success_msg','video idea added');
                res.redirect('/ideas');
            })
    }
});


//edit form process
router.put('/edit/:id',ensureAuthenticated,(req,res)=>{
    Idea.findOne({
        _id:req.params.id

    })
    .then((idea)=>{
        
        idea.title=req.body.title;
        idea.details=req.body.details;
    
        idea.save().then(idea=> {
            req.flash('success_msg','video idea updated');
            res.redirect('/ideas')
        })
    });
});

//dlete idea
router.delete('/:id',ensureAuthenticated,(req,res)=>{
    Idea.deleteMany({_id:req.params.id})
    .then(()=>{
        req.flash('success_msg','video idea removed');
        res.redirect('/ideas');
    });
});

module.exports=router;