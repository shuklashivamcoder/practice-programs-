// code using object

let name = prompt('Enter user name:');
let uniqueid = Math.floor(Math.random() * 10000) + 1; // Generate a better random unique ID
let task = prompt('Enter task title:');
let description = prompt('Enter task description:');
let startDate = prompt('Enter start date (yyyy-mm-dd):');
let endDate = prompt('Enter end date (yyyy-mm-dd):');

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

console.log(`Your unique ID is ${uniqueid}`);
let uniqueidenter = parseInt(prompt('Enter your unique ID to continue with crud operations:'));

function verifyId() {
    if (uniqueid === uniqueidenter) {
        return true;
    }
    let reenterid = parseInt(prompt('Please enter valid unique ID, try again:'));
    return reenterid === uniqueid;
}

if (!verifyId()) {
    console.log('Error: Invalid unique ID.');
    return;
}

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

function ud(user) {
    let field = prompt('Enter field to update (name, task, startd, endd):');
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

function deleting(user) {
    let field = prompt('Enter field to delete (name, task, startd, endd):');
    if (field === 'name') {
        user.name = '';
    } else if (field === 'task') {
        user.tasked = [];
    } else if (field === 'startd') {
        user.startd = '';
    } else if (field === 'endd') {
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



// code without using object


 let uniqueid = Math.floor(Math.random()+1)
    let task = prompt('enter task title')
let description = prompt('enter task description what kind of work you will do')
let startDate = prompt('enter start date format(yyyy-mm-dd):')
let enddate = prompt('enter enddate (yyyy-mm-dd):')

if(!startDate){
    startDate = new Date()
}
console.log( 'we are taking startDate as today date', startDate)
if(!enddate){
    enddate = new Date(startDate)
    enddate.setDate(startDate.getDate()+1)
    console.log('we are taking enddate as tommorow:', enddate)
}
console.log(`your uniqueid is ${uniqueid}`)
let uniqueidenter = parseInt(prompt('enter your unique id to continue with crud operation'))

if(uniqueid === uniqueidenter){
    tasked()
}else{
  let reenterid =  prompt('please enter valid uniqueid try again:')
  if(reenterid == uniqueid)
    tasked()
    else{
        let error = 'error'
        return error
    }
}

// handling and taking data from
// let useralldetails = function userdetails(){
//     let uniqueid = Math.floor(Math.random()+1)
//     let task = prompt('enter task title')
// let description = prompt('enter task description what kind of work you will do')
// let startDate = prompt('enter start date')
// let enddate = prompt('enter enddate ')

// if(!startDate){
//     startDate = new Date()
// }
// console.log( 'we are taking startDate as today date', startDate)
// if(!enddate){
//     enddate = new Date(startDate)
//     enddate.setDate(startDate.getDate()+1)
//     console.log('we are taking enddate as tommorow:', enddate)
// }
// console.log(uniqueid)
// let uniqueidenter = parseInt(prompt('enter your unique id to continue with crud operation'))

// if(uniqueid === uniqueidenter){
//     tasked()
// }else{
//     console.log('enter valid uniqueid')
// }

// }



function tasked(uniqueid,task, description, startDate, enddate){
    
   
    console.log('here are basic details about commands to do crud op')
    console.log(`for create enter 'cr'`)
    console.log(`for read enter 'rd'`)
    console.log(`for update enter 'ud' ` )
    console.log(`for delete enter delete`)
    console.log(`for terminate enter terminate`)
    

}
     
    let commands = prompt('enter what operation you want to do ')
    if(commands == 'cr'){
        cr()
    }else if(commands == 'rd'){
    rd(uniqueid,task, description, startDate, enddate)
    }else if(commands == 'ud'){
        ud(uniqueid,task, description, startDate, enddate)
    }else if(commands == 'delete'){
        deleting(uniqueid,task, description, startDate, enddate)
    }
   else if(commandread == 'terminate') {
      return
  }else {
      console.log('please enter correct command')
  }




// for handling cr
function cr(){
    console.log('creating new task with new uniqueid')
    
    
      
     let commandcreate = prompt('enter what operation you want to do ')
    if(commandcreate == 'cr'){
        cr()
    }else if(commandcreate == 'rd'){
    rd(uniqueid,task, description, startDate, enddate)
    }else if(commandcreate == 'ud'){
        ud(uniqueid,task, description, startDate, enddate)
    }else if(commandcreate == 'delete'){
        deleting(uniqueid,task, description, startDate, enddate)
    }
   else if(commandread == 'terminate') {
      return
  }else {
      console.log('please enter correct command')
  }
}

// for handling read 
// function rd(uniqueid,task, description, startDate, enddate){
//     let verification = parseInt(prompt('enter uniqueid for verification'))
//     if(uniqueid == verification){
        
//         console.log(`your task : ${task},\n task description is ${description}\n, startdate : ${startDate},\n enddate ${enddate}`)
//     }
    
// }

// for handling update

function ud(uniqueid,task, description, startDate, enddate){
    console.log('updating...')
    let enterfield = prompt('enter field that you want to change')
    if(enterfield == 'task'){
      console.log(`your perevious task is ${task} `)
      let newtask = prompt('enter new task')
      task = newtask
      console.log(`updated feild is task value ${task}`)
    }else if(enterfield == 'description'){
        console.log(`your previous desription is ${description}`)
        let newdescription = prompt('enter new description')
        description = newdescription;
        console.log(`updated feild is description value ${description}`)
    }else if(enterfield == 'startDate'){
        console.log(`previous set date is ${startDate}`)
        let newStartDate = prompt(`enter new start date`)
        startDate = newStartDate
        console.log(`updated feild is startDate value ${startDate}`)
    }else if(enterfield == 'enddate'){
        console.log(`your previous set date is ${enddate}`)
        let newEndDate = prompt('enter new end date')
        enddate = newEndDate
        console.log(`updated feild is enddate value ${enddate}`)
    }else {
         console.log('please select correct fields: ')
    }
    
     let commandupdate = prompt('enter what operation you want to do ')
    if(commandupdate  == 'cr'){
        cr()
    }else if(commandupdate  == 'rd'){
    rd(uniqueid,task, description, startDate, enddate)
    }else if(commandupdate  == 'ud'){
        ud(uniqueid,task, description, startDate, enddate)
    }else if(commandupdate == 'delete'){
        deleting(uniqueid,task, description, startDate, enddate)
    }
  else if(commandread == 'terminate') {
      return
  }else {
      console.log('please enter correct command')
  }
}

// for handling deleting
function deleting(){
    console.log('deleting...')
    let deletefield = prompt('enter field that you want to delete')
    if(deletefield == 'task'){
      console.log(`your perevious task is :${task} `)
      task = 'empty'
      console.log(`deleted feild is task value :${task}`)
    }else if(deletefield == 'description'){
        console.log(`your previous desription is :${description}`)
    
        description = 'empty';
        console.log(`deleted feild is description value :${description}`)
    }else if(deletefield == 'startDate'){
        console.log(`previous set date is :${startDate}`)
        startDate = 'empty'
        console.log(`deleted feild is startDate value :${startDate}`)
    }else if(deletefield== 'enddate'){
        console.log(`your previous set date is :${enddate}`)
        enddate = 'empty'
        console.log(`deleted feild is enddate value :${enddate}`)
    }
    console.log('deleted successfully')
     let commanddelete = prompt('enter what operation you want to do ')
    if(commanddelete == 'cr'){
        cr()
    }else if(commanddelete== 'rd'){
    rd(uniqueid,task, description, startDate, enddate)
    }else if(commanddelete == 'ud'){
        ud(uniqueid,task, description, startDate, enddate)
    }else if(commanddelete == 'delete'){
        deleting(uniqueid,task, description, startDate, enddate)
    }
   else if(commandread == 'terminate') {
      return
  }else {
      console.log('please enter correct command')
  }

}


function rd(uniqueid,task, description, startDate, enddate){
    let verification = parseInt(prompt('enter uniqueid for verification'))
    if(uniqueid == verification){
        console.log(`your task : ${task},\n task description is ${description}\n, startdate : ${startDate},\n enddate ${enddate}`)
    }
    
     let commandread = prompt('enter what operation you want to do ')
    if(commandread == 'cr'){
        cr()
    }else if(commandread == 'rd'){
    rd(uniqueid,task, description, startDate, enddate)
    }else if(commandread == 'ud'){
        ud(uniqueid,task, description, startDate, enddate)
    }else if(commandread == 'delete'){
        deleting(uniqueid,task, description, startDate, enddate)
    }
  else if(commandread == 'terminate') {
      return
  }else {
      console.log('please enter correct command')
  }
    
}


// tasked()







