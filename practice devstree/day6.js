
//guessing a number game


import readline from 'readline'
import fs from 'fs'


const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

let usergues;
let restart ;
let gamehistory = []

r1.question('guess number between 1 to 10',(ans)=>{
 usergues = ans
  if (isNaN(usergues) || usergues < 1 || usergues > 10) {
    console.log('Invalid input. Please enter a number between 1 and 10.');
    rl.close();
    return;
  }




function spinwheel(){
    console.log('spining...')
}
setTimeout(spinwheel,2000)

  function num(){
     const array = []
        for (let i = 0; i <= 6; i++) {
            const random = Math.floor(Math.random() * 10) + 1
            array.push(random)
        }

      array.forEach((val, index) => {
            setTimeout(() => {
                console.log(val)
                if(index == 6 && val == ans){
                    console.log('wheel stop at',val)
                    console.log('you wiin the game')
                    let win = 'win'
                    gamehistory.push(win)
                    console.log('your game history')
                    gamehistory.forEach((val,index)=>{
                        console.log(index+1,val)
                        gamehistory.unshift()
                    })
                    console.log(`'your game history is:'${gamehistory}`)
                    r1.question('do you want to play again',(yes)=>{
                        if(yes == 'yes'  ){
                            setTimeout(num,2000)
                            gamehistory.push(win)
                            // console.log(gamehistory)
                            if(gamehistory.length > 5){
                                console.log('you cannot play again')
                                r1.close();
                                
                                return;
                            }
                            
                        }
                        else{
                            r1.close();
                            return
                        }
                    })
                   
                    
                }else if(index == 6){
                    console.log('wheel stop at',val)
                    console.log('you loss better luck next time')
                    let loss = 'loss'
                    gamehistory.push(loss)
                   console.log('your game history')
                    gamehistory.forEach((val,index)=>{
                        console.log(index+1,val)
                        gamehistory.unshift()
                    })
                    console.log(`'your game history is:'${gamehistory}`)
                     r1.question('do you want to play again',(yes)=>{
                        if(yes == 'yes' ){
                            setTimeout(num,2000)
                            gamehistory.push(loss)
                           // console.log(gamehistory)
                          if(gamehistory.length > 5){
                                console.log('you cannot play again') 
                                r1.close();
                                return
                            }
                          }  else{
                            r1.close();
                            return
                        }
                    })
                    
                }
            }, (index + 1) * 1000)
            })

        }
  setTimeout(num,2000)
    //
})
