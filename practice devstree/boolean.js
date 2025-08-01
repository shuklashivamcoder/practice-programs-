// first i try the code here when it succeed then only i write in the day1.js file


// let num = 89;
// num = 67
// let bool = Boolean(num)
// console.log(bool)

let res = '5' - 1 + '2';
console.log(res)
console.log(typeof res)

// let n = 10;

//  let fact = (n) => {
//  if( n == 1){
//     console.log('factorial is:', 1);
//  }else if(n == 0){
//   console.log('factorila is :',0)
//  }
// let res = 1;
//  for(let i = 2; i <= n; i++){
//    res = res * i

//  }

// console.log(res)

//  }

//  fact(n)


// let n = 4;

//  let fact = (n) => {
//  if( n == 1){
//     console.log('factorial is:', 1);
//  }else if(n == 0){
//   console.log('factorila is :',0)
//  }
// let res = 0;
//  for(let i = 0; i <= n; i++){
//    res = res + i
//    console.log(res)
//  }



//  }

//  fact(n)

//  for (let i = 0; i <= 1000; i++) {
//     let guessnum = parseInt(prompt('enter a number')) 
//     if (guessnum === 10) {
//         console.log('you win the game')
//         break;
//     } else {
//         console.log('try again')

//     }

// }


// function ispalindrome(str) {

//     let cleanstr = ''
//     for (let i = 0; i < str.length; i++) {
//         const char = str[i]

//         if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || (char >= 0 && char <= 9)) {
//             cleanstr += char.toLowerCase()
//         }
//     }
//     let left = 0;
//     let right = cleanstr.length - 1;

//     while (left < right) {
//         if (cleanstr[left] !== cleanstr[right]) {
//             return false;
//         }
//         left++;
//         right--;
//     }
//     return true;

// }



// console.log(ispalindrome('shivam'))
// console.log(ispalindrome('racecar'))
// console.log(ispalindrome('madam'))
// console.log(ispalindrome('hello'))

// let str = 'shivam'
//   let reverse = ''
// function reversestr(str){
//     for(let i = str.length-1; i >= 0 ; i--){
//        reverse = reverse + str[i]
//     }
//     console.log(reverse)
// }

//  reversestr(str)


let array = [4,523,1,6,777,7,7,6]

 
let newarray = array.filter((item, index)=>{
    return array.indexOf(item) === index;
})
      console.log(newarray)

        
        