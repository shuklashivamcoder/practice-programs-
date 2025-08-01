// finding largest number in array

let array = [1, 2, 3, 4, 5, 6, 1000]

function findlargestnum(array) {

    // using reduce method

    let largest = array.reduce((prev, curr) => {
        return (prev > curr) ? prev : curr;
    })
    return largest

    // custom or short way
    // let largest = Math.max(...array)
    // return largest
}
let large = findlargestnum(array)
console.log(large)

//function for printing sum of all element of array

function summarray(array) {
    let sum = array.reduce((prev, current) => {
        return prev + current
    })
    return sum
}

let sum = summarray(array)
console.log(sum)

// creating a function that reverse the given array

function reversearray(array) {
    let reverse = array.reverse()
    return reverse
}

let reverse = reversearray(array)
console.log(reverse)

// function to reverse the given string

let str = 'shivam'
  let reversed = ''
function reversestr(str){
    for(let i = str.length-1; i >= 0 ; i--){
       reversed = reverse + str[i]
    }
    console.log(reversed)
}

 reversestr(str)


// function to check the given string is palindrome or not


function ispalindrome(str) {
   let cleanstr = ''

   for(let i = 0; i < str.length; i++){
    const char = str[i]

    if((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || (char >= 0 && char <= 9)){

        cleanstr += char.toLowerCase()

    }
}
   let left = 0;
   let right = cleanstr.length-1;

   while(left < right){
    if(cleanstr[left] != cleanstr[right]){
        return false
    }
    left++;
    right--;
   }
   return true

   

}

console.log(ispalindrome('madam'))
console.log(ispalindrome('shivam'))


// function for guessing number by user

for (let i = 0; i <= 1000; i++) {
    let guessnum = 8;  // this will run again and again(upto 1000 times) until you correct the value (do not run)
    if (guessnum === 10) {
        console.log('you win the game')
        break;
    } else {
        console.log('try again')

    }

}

// better way to write the above code 


let guessnum = prompt('enter a number')
let numrequired = 10 

while(guessnum !== numrequired){
    console.log('try again')
}
console.log(' you won the game ')


// function for calculating factorial of number n

let n = 10;

let fact = (n) => {
    if (n == 1 || n == 0) {
        console.log('factorial is:', 1);
    }
    let res = 1;
    for (let i = 2; i <= n; i++) {
        res = res * i

    }

    console.log(res)

}

fact(n)