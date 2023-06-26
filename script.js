'use strict';

const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2,
    pin: 1111,
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];


const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const currencies = new Map([
    ['USD', 'United States dollar'],
    ['EUR', 'Euro'],
    ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];



const displaymovements = (move) =>{

    containerMovements.innerHTML=''
     
    move.forEach((element, index) => {

        const type = element<0?"withdrawal":"deposit"

        const html = `
        <div class="movements">

            <div class="movements__row">
                <div class="movements__type movements__type--${type}">${index+1 +" "+ type}</div>
                
                <div class="movements__value">${element+"€"}</div>

            </div>

        </div>`
        // <div class="movements__date">3 days ago</div>

        containerMovements.insertAdjacentHTML('afterbegin',html)
    });
}




const createusers = ((accs)=>{
    
    accs.forEach((acc)=>{

        acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map((single)=>single[0])
        .join('')
    })
})


const deposits = movements.filter((sample)=>{
    return sample>0;
})

const withdrawals = movements.filter((sample)=>{
    return sample<0;
})

let bal;

const calDisplayBalanace =(acc)=>{

    acc.bal = acc
    .movements
    .reduce((acc,cur)=>
    acc + cur
    ,0)
    // acc.balance = balance
    labelBalance.textContent = `${acc.bal} EUR`
}

const max = (move) => {

    const m =move.reduce((acc,cur)=>
    {
        if (cur>acc)
            return cur
        else
            return acc;
    })
    return m;
}

const positive = (acc)=>{
    
    const value =
        acc.movements
        .filter((sample)=>sample>0)
        .reduce((acc,sample)=>acc+sample,0);
    labelSumIn.textContent = `${value}`


    const outvalue = 
        acc.movements
        .filter((sample)=>sample<0)
        .reduce((acc,sample)=>acc+sample,0);
    labelSumOut.textContent = `${Math.abs(outvalue)}`

    const intrst = 
        acc.movements
        .filter((sample)=>sample>0)
        .map((depo)=>depo*acc.interestRate/100)
        .filter((sample)=>sample>=1)
        .reduce((acc,sample)=>acc+sample,0);

    labelSumInterest.textContent = `${intrst}`

}






let createacc;

btnLogin.addEventListener('click',(e)=>{

    e.preventDefault();

    createacc = accounts.find( 
        acc=>acc.username === inputLoginUsername.value
    );



    if(createacc?.pin === Number(inputLoginPin.value))
    {
        labelWelcome.textContent =`Welcome back${createacc.owner}`
        containerApp.style.opacity= 100;


        inputLoginUsername.value = inputLoginPin.value =''

        inputLoginPin.blur()

        calDisplayBalanace(createacc)

        displaymovements(createacc.movements)

        positive(createacc)
    }
});

createusers(accounts)


btnTransfer.addEventListener('click',(e)=>{
    e.preventDefault()

    const amout = Number(inputTransferAmount.value)

    const search = accounts.find((acc)=>
        acc.username===inputTransferTo.value
    )
    
    inputTransferAmount.value = inputTransferTo.value = ''
    
    
    if(amout>0 && search &&
    createacc.bal>=amout 
    && search?.username!==createacc.username)
    {
        createacc.movements.push(-amout)
        search.movements.push(amout)
    }

    inputLoginPin.blur()

    calDisplayBalanace(createacc)

    displaymovements(createacc.movements)

    positive(createacc)
    
})


btnClose.addEventListener('click',(e)=>{

    e.preventDefault()



    const index = accounts.findIndex((acc)=>
        acc.username === createacc.username && acc.pin===createacc.pin
    )

    accounts.splice(index,1)
    containerApp.style.opacity= 0;

    inputCloseUsername.value = inputClosePin.value = ''
})

btnLoan.addEventListener('click',(e)=>{

    e.preventDefault();

    const inputamt  =Number(inputLoanAmount.value)

    if(inputamt>0 && createacc.movements.some(mov=>mov>=inputamt*0.1)){
        
        createacc.movements.push(inputamt)

    }



    calDisplayBalanace(createacc)

    displaymovements(createacc.movements)

    positive(createacc)


    inputLoanAmount.value=''
})

btnSort.addEventListener('click',(e)=>{
    e.preventDefault();   

    createacc.movements = Number(createacc.movements.sort());

    displaymovements(createacc.movements)

})

// const array = accounts
//     .map((acc)=>
//      acc.movements)
//     .flat()
//     .reduce((acc,cur)=>
//         acc+=cur,0)


//     console.log(array)
  