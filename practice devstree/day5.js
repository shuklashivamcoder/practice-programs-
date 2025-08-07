//  import readline from 'readline';
 
//  const r1 = readline.createInterface({
//      input: process.stdin,
//      output: process.stdout
//  })
 
// //  function timer(){
// //     setTimeout(()=>{
// //      console.log('hello')
// //      let response = 'response';
// //      console.log(response);
// //     },5000)
// //  }
// // //  normal()
// //  async function fetchdata(){
// //     //  console.log(api)
// //   const shivam = await timer()
// //   console.log(shivam)
// //   return shivam
// // }
// // fetchdata()

// // function createOrder(cart,d){
// //     let orderiD = 'werr';
// //  d(orderiD) ;
// // }
// // function proceddtopayment(orderiD,s){
// //     console.log('success',orderiD)
    
// // }
// let cart = []

// function mainmenu(cart){
//     console.log('what do you want to buy from our store find list of product')
//     console.log('shirt price 999')
//     console.log('tshirt price 2999')
//     console.log('shirt price 299')
//     r1.question('tell me product name',(ans)=>{
//       cart.push(ans)
//       createOrder(cart)
//     })
// }

// mainmenu(cart)

// function createOrder(cart){
//     if(!cart){
//         console.log('please add product to the card')
//     }else {
//         console.log('your product id is')
//         var productid = Math.floor(Math.random()*1000)+1
//         console.log(productid)
//     }

//    proceedtopayment(productid)
// }

// function proceedtopayment(productid){
//     if(!productid){
//         console.log('productid is not valid')
//     }else{
//         r1.question('enter your debit card number', (ans)=>{
//             if(!ans){
//                 console.log('please provide valid card number')
//             }else {
//                 console.log('payment succesfull');
//             }
//         })
//     }
// }



// // createOrder(cart,(orderiD)=>{
// //   proceddtopayment(orderiD,()=>{
// //       console.log('end')
// //   })
// // })



// small ecommerce store without ui just cli 

 import readline from 'readline';

import fs from 'fs'


const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

//  function timer(){
//     setTimeout(()=>{
//      console.log('hello')
//      let response = 'response';
//      console.log(response);
//     },5000)
//  }
// //  normal()
//  async function fetchdata(){
//     //  console.log(api)
//   const shivam = await timer()
//   console.log(shivam)
//   return shivam
// }
// fetchdata()

// function createOrder(cart,d){
//     let orderiD = 'werr';
//  d(orderiD) ;
// }
// function proceddtopayment(orderiD,s){
//     console.log('success',orderiD)

// }
let cart = []
const tshirt = [{
    name: 'uspolo',
    price: 1200405,
    issale: true,
    description: 'premium'
},
{
    name: 'pdy',
    price: 120000,
    issale: true,
    description: 'premium'
},
{
    name: 'dfdf',
    price: 200,
    issale: true,
    description: 'premium'
},
{
    name: 'fdf',
    price: 299,
    issale: true,
    description: 'premium'
}
]

const pants = [{
    name: 'denim',
    price: 1200405,
    issale: true,
    description: 'premium'
},
{
    name: 'jeans',
    price: 120000,
    issale: true,
    description: 'premium'
},
{
    name: 'no',
    price: 40,
    issale: true,
    description: 'premium'
},
{
    name: 'jdjd',
    price: 399,
    issale: true,
    description: 'premium'
}
]

function admin() {
    r1.question('who are you admin or user', (ans) => {
        if (ans == 'admin') {
        r1.question('tell me password',(password)=>{
            if(password == 'shivam'){
                 r1.question('give me id', (ans) => {
                r1.question('give me product name', (name) => {
                    r1.question('give me category', (category) => {
                        const object = [{

                            "id": ans,
                            "name": name,
                            "category": category
                        }]
                        let jsonstringfy = JSON.stringify(object,null,2)
                        console.log(object)
                        fs.writeFile('product.js',jsonstringfy,(error, data)=>{
                            if(error){
                                console.log(error)
                            }
                            console.log('data uploaded successfully')
                        })
                    })
                })
            })
            }else {
                console.log('you re not admin')
                mainmenu(cart)
            }
        })
        } else {
            mainmenu(cart)
        }
    })
}
admin()


async function mainmenu(cart) {
    // console.log('what do you want to buy from our store find list of product')
    // console.log('shirt price 999')
    // console.log('tshirt price 2999')
    // console.log('shirt price 299')
    console.log('what you want to buy tshirt or pant write below')
    r1.question(' search please', (product) => {
        if (product == 'tshirt') {
            console.log(tshirt)
            r1.question('tell only one product name', (ans) => {
                let selected = tshirt.find(tshirt => tshirt.name == ans)
                if (!ans) {
                    console.log('cart is empty please select')
                } else {
                    console.log('your product details is :', selected)
                    console.log('your total payable amount is:', selected.price)
                    cart.push(ans)
                    console.log('your product is :', cart)
                    createOrder(cart)
                }

                //  cart.push(ans)
                //  console.log('your product is :',cart)
                //  createOrder(cart)


            })
        } else if (product == 'pants') {
            console.log(pants)
            r1.question('tell only one product name', (ans) => {
                let selected = pants.find(pant => pant.name == ans)
                if (!ans) {
                    console.log('cart is empty please select')

                } else {
                    console.log('your product details is :', selected)
                    console.log('your total amount is:', selected.price)
                    cart.push(ans)

                    console.log('your product name is :', cart)
                    createOrder(cart)
                }
                //      cart.push(ans)

                //  console.log('your product name is :',cart)
                //   createOrder(cart)
            })
        } else {
            console.log('product not found')
        }

    })
    //   cart.push(ans)


}

mainmenu(cart)

function createOrder(cart) {
    if (!cart) {
        console.log('please add product to the card')
    } else {
        console.log('your product id is')
        var productid = Math.floor(Math.random() * 1000) + 1
        console.log(productid)
        console.log('redirecting to checkout page')
    }

    proceedtopayment(productid)
}

function proceedtopayment(productid, cart) {
    if (!productid) {
        console.log('productid is not valid')
    } else {
        r1.question('enter your debit card number', (ans) => {
            if (ans.length != 10 || ans == '') {
                console.log('please provide valid card number payment cancel')
                mainmenu(cart)
            } else {
                console.log('payment succesfull');
                console.log('redirecting to the home page ')
                mainmenu(cart)
            }
        })
    }
}


// console.log(products)

// createOrder(cart,(orderiD)=>{
//   proceddtopayment(orderiD,()=>{
//       console.log('end')
//   })
// })

