let a = parseInt(prompt('Enter number a'));
let b = parseInt(prompt('Enter number b'));
let op = {
    addition: '+',
    subtraction: '-',
    multiplication: '*',
    division: '/',
    modulus: '%'
};
let command = prompt('Enter command (addition, subtraction, multiplication, division, modulus)');

function calc(a, b, op, command) {
    switch (command) {
        case 'addition':
            console.log(a + b);
            break;
        case 'subtraction':
            console.log(a - b);
            break;
        case 'multiplication':
            console.log(a * b);
            break;
        case 'division':
            if (b !== 0) {
                console.log(a / b);
            } else {
                console.log('Cannot divide by zero');
            }
            break;
        case 'modulus':
            if (b !== 0) {
                console.log(a % b);
            } else {
                console.log('Cannot perform modulus by zero');
            }
            break;
        default:
            console.log('Please enter a valid command');
    }
}

calc(a, b,op, command)