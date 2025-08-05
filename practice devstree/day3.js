// task reversing an array

// let array = [1,2,3,4]
// let reversearr = []

//  function reverse(array){
//     reversearr = array.reverse()
//     console.log(reversearr);
// }
//  reverse(array)



// for(let i = array.length-1; i >= 0; i--){
//     reversearr += array[i]
//     array.push(reversearr)
//  }
// console.log(reversearr)
// console.log(typeof reversearr)

// crud operation using readline 


import readline from 'readline'
const readed = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

async function askquestion(query){
const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
let des = new Promise ((resolve) => read.question(query, (ans)=>{
    resolve(ans)
}));
return des;
// return  new Promise((resolve) => read.question(query, ans =>{
//     resolve(ans)
// }));
}
let uniqueid;
let uniqueidenter
let name; 
let task;
let description;
let startDate;
let endDate;
let field;
let fieldsdelete ;
 
name = await askquestion('enter your name');
task = await askquestion('enter your task');
description = await  askquestion('enter your description');
startDate = await askquestion('enter your startdate');
endDate = await askquestion('enter your enddate');
field = await askquestion('enter field that you want to change');
fieldsdelete = await askquestion('enter field that you want to delete');


if (!startDate) {
    startDate = new Date().toISOString().slice(0, 10);
    console.log('No start date provided. Using today:', startDate);
}
if (!endDate) {
    let tomorrow = new Date(startDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    endDate = tomorrow.toISOString().slice(0, 10);
    console.log('No end date provided. Using tomorrow:', endDate);
}
 uniqueid = Math.floor(Math.random() * 10000) + 1;

console.log(`Your unique ID is ${uniqueid}`);
// readed.question('Enter your unique ID to continue with crud operations:',(ans)=>{
//     function verifyId() {
//     if (uniqueid === uniqueidenter) {
//         return true;
//     }
//     let reenterid = parseInt(prompt('Please enter valid unique ID, try again:'));
//     return reenterid === uniqueid;
// }

// if (!verifyId()) {
//     console.log('Error: Invalid unique ID.');
//     // return;
// }
    
// })


// function verifyId() {
//     if (uniqueid === uniqueidenter) {
//         return true;
//     }
//     let reenterid = parseInt(prompt('Please enter valid unique ID, try again:'));
//     return reenterid === uniqueid;
// }

// if (!verifyId()) {
//     console.log('Error: Invalid unique ID.');
//     // return;
// }

let user = {
    uniqueid: uniqueid,
    name: name,
    tasked: [task],
    description: description,
    startd: startDate,
    endd: endDate
};

function showCommands() {
    console.log('CRUD Commands:');
    console.log("For create enter 'cr'");
    console.log("For read enter 'rd'");
    console.log("For update enter 'ud'");
    console.log("For delete enter 'delete'");
    console.log("For terminate enter 'terminate'");
}

function cr(user, uniqueid) {
    let newTask = prompt('Enter new task title:');
    user.tasked.push(newTask);
    console.log('Task added.');
    rd(user);
}

function rd(user) {
    console.log('User data:', user);
}

function ud(user, field) {
    // let field = prompt('Enter field to update (name, task, startd, endd):');
    if (field === 'name') {
        user.name = prompt('Enter new name:');
    } else if (field === 'task') {
        let newTask = prompt('Enter new task:');
        user.tasked.push(newTask);
    } else if (field === 'startd') {
        user.startd = prompt('Enter new start date (yyyy-mm-dd):');
    } else if (field === 'endd') {
        user.endd = prompt('Enter new end date (yyyy-mm-dd):');
    } else {
        console.log('Invalid field.');
    }
    rd(user);
}

function deleting(user, fieldsdelete ) {
    let fieldsdelete = prompt('Enter field to delete (name, task, startd, endd):');
    if (fieldsdelete  === 'name') {
        user.name = '';
    } else if (fieldsdelete  === 'task') {
        user.tasked = [];
    } else if (fieldsdelete  === 'startd') {
        user.startd = '';
    } else if (fieldsdelete  === 'endd') {
        user.endd = '';
    } else {
        console.log('Invalid field.');
    }
    rd(user);
}

function crudLoop(user) {
    showCommands();
    while (true) {
        let command = prompt('Enter operation:');
        if (command === 'cr') {
            cr(user);
        } else if (command === 'rd') {
            rd(user);
        } else if (command === 'ud') {
            ud(user);
        } else if (command === 'delete') {
            deleting(user);
        } else if (command === 'terminate') {
            console.log('Terminating...');
            break;
        } else {
            console.log('Please enter a correct command.');
        }
    }
}

crudLoop(user);

// final code for today task


import readline from 'readline'

const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const user = {
    uniqueid : [],
    name: [],
    task: [],
    description: [],
    startdate:[] ,
    enddate: []
}

function userdetails(user, r1, callback){
    r1.question('what is your name',(name)=> {
        user.name = name;
        r1.question('what is task',(task)=>{
            user.task = task;
            r1.question('what is description',(description)=>{
                user.description = description;
                r1.question('what is startdate', (startdate)=>{
                    if (!startdate) {
    user.startdate = new Date().toISOString().slice(0, 10);
    console.log('No start date provided. Using today:', startdate);
}else {
                    user.startdate = startdate;
}
      r1.question('what is enddate',(enddate)=>{
            if (!enddate) {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    user.enddate = tomorrow.toISOString().slice(0, 10);
    console.log('No end date provided. Using tomorrow:', enddate);
}else{
                        user.enddate = enddate;
}
                        showCommands()
                    })
                   
                })
            })
        })
    })
     
}


function showCommands() {
    console.log('CRUD Commands:');
    console.log("For create enter 'cr'");
    console.log("For read enter 'rd'");
    console.log("For update enter 'ud'");
    console.log("For delete enter 'delete'");
    console.log("For terminate enter 'terminate'");
    r1.question('what operation you want do',(op) =>{
   if(op == 'cr'){
       create(user);
   }else if(op == 'read'){
       read(user)
   }else if(op == 'ud'){
       update(user)
   }else if(op == 'delete'){
       deleted(user)
   }else {
       console.log('please enter correct command')
   }
})
}

function create(){
    console.log('creating')
    userdetails(user,r1,callback)
}
function read(user){
    console.log(user)
}


function update(user){
    r1.question('which field you need to change[name, task , descrrption',(updatefield) =>{
    if(updatefield == 'name'){
            r1.question('which field you need to change[name, task , descrrption',(newname) =>{
                user.name = newname
        })
    }else if(updatefield == 'task'){
            r1.question('which field you need to change[name, task , descrrption',(newname) =>{
                user.task = newname
        })
        }else if(updatefield == 'task'){
            r1.question('which field you need to change[name, task , descrrption',(newname) =>{
                user.description = description;
       }) 
            
        }
    
    console.log('updated successfully')
    read(user)
})
}
function deleted(r1,user){
    r1.question('enter what to delete [name, task, desc]',(field)=>{
        if(field == 'name'){
            user.name = []
        }else if(field == 'task'){
            user.task = []
        }else if(field == 'desc'){
            user.description = []
        }
    })
    console.log('updated user successfully')
    read(user)
}

userdetails(user, r1)

// more updated code 

import readline from 'readline'

const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const user = {
    uniqueid : [],
    name: [],
    task: [],
    description: [],
    startdate:[] ,
    enddate: []
}

function userdetails(user, r1, callback){
    r1.question('what is your name',(name)=> {
        user.name = name;
        r1.question('what is task',(task)=>{
            user.task = task;
            r1.question('what is description',(description)=>{
                user.description = description;
                r1.question('what is startdate', (startdate)=>{
                    if (!startdate) {
    user.startdate = new Date().toISOString().slice(0, 10);
    console.log('No start date provided. Using today:', startdate);
}else {
                    user.startdate = startdate;
}
      r1.question('what is enddate',(enddate)=>{
            if (!enddate) {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    user.enddate = tomorrow.toISOString().slice(0, 10);
    console.log('No end date provided. Using tomorrow:', enddate);
}else{
                        user.enddate = enddate;
}
                        showCommands()
                    })
                   
                })
            })
        })
    })
     
}


function showCommands() {
    console.log('CRUD Commands:');
    console.log("For create enter 'cr'");
    console.log("For read enter 'rd'");
    console.log("For update enter 'ud'");
    console.log("For delete enter 'delete'");
    console.log("For terminate enter 'terminate'");
    r1.question('what operation you want do',(op) =>{
   if(op == 'cr'){
       create(user);
   }else if(op == 'read'){
       read(user)
   }else if(op == 'ud'){
       update(user)
   }else if(op == 'delete'){
       deleted(user)
   }else {
       console.log('please enter correct command')
   }
})
}

function create(){
    console.log('creating')
    userdetails(user,r1,callback)
}
function read(user){
    console.log(user)
}


function update(user){
    r1.question('which field you need to change[name, task , descrrption',(updatefield) =>{
    if(updatefield == 'name'){
            r1.question('which field you need to change[name, task , descrrption]',(newname) =>{
                user.name.push(newname)
        })
    }else if(updatefield == 'task'){
            r1.question('which field you need to change[name, task , descrrption',(task) =>{
                user.task.push(task)
        })
        }else if(updatefield == 'task'){
            r1.question('which field you need to change[name, task , descrrption',(description) =>{
                user.description.push(description);
       }) 
            
        }
    
    console.log('updated successfully')
    read(user)
})
}
function deleted(r1,user){
    r1.question('enter what to delete [name, task, desc]',(field)=>{
        if(field == 'name'){
            user.name = []
        }else if(field == 'task'){
            user.task = []
        }else if(field == 'desc'){
            user.description = []
        }
    })
    console.log('updated user successfully')
    read(user)
}

userdetails(user, r1)