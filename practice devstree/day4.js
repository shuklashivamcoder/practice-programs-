//callback practice question


function multiply(a,b,c){
    setTimeout(()=>{
        console.log(a*b*c)
        
    },3000)
}


// add(2,4,sum)
function add(a,callback){
// console.log('hello1')
setTimeout(()=> {
    let result = a + 4
    let b = 4;
    let c = 3;
    console.log(result)
    callback(result,b,c)
},2000)

}





add(4,()=>{
    console.log('getting another number');
  add(3,()=>{
        console.log('getting another number')
        add(2,()=>{
            console.log('getting another number')
            add(1,()=>{
                console.log('end')
            })
        });
    });
 })

 // crud operation with concating extension on filename using fs module

 import fs from 'fs'
import readline from 'readline'

// const fs = fs()
const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function mainmenu() {
    console.log('initialising....');
    console.log('enter number for operation associated with it');
    console.log('1 create');
    console.log('2 read');
    console.log('3 update');
    console.log('4 delete');
    r1.question('what operation you want to perform', (ans) => {
        switch (ans) {
            case '1':
                create();
                break;

            case '2':
                read();
                break;
            case '3':
                update();
            case '4':
                deleting();
                break;
            default:
                console.log('please enter valid command')
                break;
        }
    })
}

mainmenu()

function create() {
    r1.question('file name should have ext such as [.text,.js,.json,.html]:', (ans) => {
        r1.question('file content:', (content) => {
            r1.question('enter ext if not mention other wise press enter:', (ext) => {
                if (ext) {
                    var joint = ans + ext
                    fs.writeFile(joint, content, 'utf-8', (error, data) => {
                        if (error) {
                            console.log(error)
                        }
                        console.log('file created successfully')
                        mainmenu()
                    })
                } else if (!ext) {
                    fs.writeFile(ans, content, 'utf-8', (error, data) => {
                        if (error) {
                            console.log(error)
                        }
                        console.log('file created successfully')
                        mainmenu()
                    })
                }


            })
        })

    })

}

function update() {
    r1.question('what do you want to update[filename , content]', (ans) => {
        if (ans == 'filename') {
            r1.question('enter existing file name:', (exist) => {
                // if(!exist){
                //   fs.writeFile(exist,'',(error,data)=>{
                //     console.log('created successfully')
                //   })
                // }
                r1.question('new name:', (newname) => {
                    fs.rename(exist, newname, (error, data) => {
                        if (error) {
                            console.log('error:', error)
                        }
                        console.log('updated successfully')
                        mainmenu()
                    })
                })
            })
        }
        else if (ans == 'content') {
            r1.question('which file you want to add data', (file) => {
                r1.question('content please:', (content) => {
                    fs.appendFile(file, content, (error, data) => {
                        if (error) {
                            console.log(error);
                        }
                        console.log('updated successfully')
                        mainmenu()
                    })
                })
            })
        }
    })
}

function read() {
    r1.question('give me file name to read data of that file', (ans) => {
        fs.readFile(ans, (error, data) => {
            if (error) {
                console.log('file name not exist or invalid command')
            }
            console.log('your data is:', data.toString())
            mainmenu()
        })
    })
}

function deleting() {
    r1.question('which file you want to delete', (ans) => {
        fs.unlink(ans, (error, data) => {
            if (error) {
                console.log(error);
            } else {
                console.log('file deleted successfully');
                mainmenu();
            }
        })
    })
}



// crud operation on file using fs module

import fs from 'fs'
import readline from 'readline'

// const fs = fs()
const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function mainmenu() {
  console.log('initialising....');
  console.log('enter number for operation associated with it');
  console.log('1 create');
  console.log('2 read');
  console.log('3 update');
  console.log('4 delete');
  r1.question('what operation you want to perform', (ans) => {
    switch (ans) {
      case '1':
        create();
        break;

      case '2':
        read();
        break;
      case '3':
        update();
      case '4':
        deleting();
        break;
      default:
        console.log('please enter valid command')
        break;
    }
  })
}

mainmenu()

function create() {
  r1.question('file name:', (ans) => {
    r1.question('file content:', (content) => {
      fs.writeFile(ans, content, 'utf-8', (error, data) => {
        if (error) {
          console.log(error)
        }
        console.log('file created successfully')
        mainmenu()
      })
    })

  })

}

function update() {
  r1.question('what do you want to update[filename , content]', (ans) => {
    if (ans == 'filename') {
      r1.question('enter existing file name:', (exist) => {
        // if(!exist){
        //   fs.writeFile(exist,'',(error,data)=>{
        //     console.log('created successfully')
        //   })
        // }
        r1.question('new name:', (newname) => {
          fs.rename(exist, newname, (error, data) => {
            if (error) {
              console.log('error:', error)
            }
            console.log('updated successfully')
            mainmenu()
          })
        })
      })
    }
    else if (ans == 'content') {
      r1.question('which file you want to add data', (file) => {
        r1.question('content please:', (content) => {
          fs.appendFile(file, content, (error, data) => {
            if (error) {
              console.log(error);
            }
            console.log('updated successfully')
            mainmenu()
          })
        })
      })
    }
  })
}

function read() {
  r1.question('give me file name to read data of that file', (ans) => {
    fs.readFile(ans, (error, data) => {
      if (error) {
        console.log('file name not exist or invalid command')
      }
      console.log('your data is:', data.toString())
      mainmenu()
    })
  })
}

function deleting() {
  r1.question('which file you want to delete', (ans) => {
    fs.unlink(ans, (error, data) => {
      if (error) {
        console.log(error);
      } else {
        console.log('file deleted successfully');
        mainmenu();
      }
    })
  })
}







