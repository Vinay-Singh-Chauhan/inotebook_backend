const express=require('express');
const router=express.Router()
const fetchUser=require('../middleware/fetchUser')
const Note=require('../models/Notes')
const { body, validationResult } = require('express-validator');
// get all the notes
router.get('/fetchAllNotes',fetchUser, async (req,res)=>{
    try{const notes=await Note.find({user:req.user.id})
    res.send(notes)}
    catch(error){
        res.status(500).send("some error")
    }
})


router.post('/addNote',fetchUser,[body('title',"enter a valid title").exists(),
    body('description',"enter a valid email").exists()], async (req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        try{const {title,description,tag}=req.body;
    const note =new Note({
        "user":req.user.id,
        "title":title,
        "description":description,
        "tag":tag
    })
    const savedNote=await note.save();
    res.send(savedNote)}
    catch(error){
        res.status(500).send("some error")
    }
})

router.put('/updateNote/:id',fetchUser, async (req,res)=>{
        try{
            const {title,description,tag}=req.body;
            const newNote={}
            if(title){newNote.title=title}
            if(description){newNote.description=description}
            if(tag){newNote.tag=tag}
            let note=await Note.findById(req.params.id);
            if(!note){
                return res.status(404).send("some error 1")
            }
            if(note.user.toString()!== req.user.id){
                return res.status(401).send("some error 2")
            }
            note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
            res.json(note);}
    catch(error){
        res.status(500).send("some error 3")
    }
})

router.delete('/deleteNote/:id',fetchUser, async (req,res)=>{
    try{
        // const {title,description,tag}=req.body;
        // const newNote={}
        // if(title){newNote.title=title}
        // if(description){newNote.description=description}
        // if(tag){newNote.tag=tag}
        let note=await Note.findById(req.params.id);
        if(!note){
            return res.status(404).send("some error 1")
        }
        if(note.user.toString()!== req.user.id){
            return res.status(401).send("some error 2")
        }
        note=await Note.findByIdAndDelete(req.params.id);
        res.json({
            success:"note is deleted"
        });}
catch(error){
    res.status(500).send("some error 3")
}
})

module.exports=router;