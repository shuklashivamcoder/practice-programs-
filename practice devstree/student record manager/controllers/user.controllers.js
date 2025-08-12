import { User } from "../models/user.models.js";
import fs from 'fs';

export async function createuser(req,res){
    try {
        const {name , age , course} = req.body
    if(!name || !age || !course){
        return 'Error';
    }
   const userdata = await User.create({ name, age, course})
   return res.json({
    message:'data saved',
    userd: userdata
   })
    }catch(error){
        return res.json({
            error: error
        })
    }
}


 export async function readuser(req,res) {
    try{
const user = await User.find({})

return res.json({
    message: 'all user data',
    userdata: user
})


    }catch(error){
        return res.json({
            message: error
        })
    }
    
}

export async function searchuser(req, res) {
    try{
     const { name } = req.params;
     const user = await User.findOne({name})

     return res.json({
        message: 'user found successfully',
        userd : user
     })
    }catch(error){
        return res.json({
            message : error
        })
    }
    
}

export async function deletestudent(req, res) {
    try{
        const {name} = req.params;
        const user = await User.findOneAndDelete({ name })

        return res.json({
            message: 'deleted successfully',
            user: user
        })
    }catch(error){
        res.json({
            error: error
        })
    }
    
}

export async function updateuserdata(req, res) {
    try{
        // const { name } = req.params;
        const updateuser = await User.findOneAndUpdate(
            { name: req.params.name },
            req.body,
            { new: true }
        )
        return res.json({
            users: updateuser
        })
     
    }catch(error){
        return res.json({
            error: error
        })
    }
    
}

export async function sortuserbyname(req, res) {
    try{
  const sorted = await User.find({}).sort({ name : 1 })
  return res.json({
    message: 'data sorted based on name',
    sorteddata : sorted
  })

    }catch(error){
        return res.json({
            error:error
        })
    }
}

export async function countcourse(req, res){
    try{
 const {cours} = req.params
 const count = await User.countDocuments({course : cours})

 return res.json({
    message: 'the total count is',
    count : count
 })

    }catch(error){
        return res.json({
            error: error
        })
    }
}

export async function exportfile(req, res) {
    try{
    const alldata = await User.find({})
    let datatext = JSON.stringify(alldata, null, 2)

    fs.appendFile('studen.text',datatext,(error,data)=>{
        if(error){
            console.log(error)
        }
        return res.json({
            message: 'file created successfully'
        })
    })

    }catch(error){
        return res.json({
            error: error
        })
    }
    
}