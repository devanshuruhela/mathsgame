// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionamount = 0;
let equationsArray = [];
let playeranswerarr = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timeplayed = 0;
let basetime = 0;
let penaltytime = 0;
let finaltime = 0;
let finaltimedisplay = '0.0s';
// route toscore page
function showscorepage()
{
  gamePage.hidden = true;
  scorePage.hidden = false;
}
// display score to player 
function scoreToDom()
{
  finaltimedisplay = finaltime.toFixed(1);
  basetime = timeplayed.toFixed(1);
  penaltytime = penaltytime.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${basetime}`;
  penaltyTimeEl.textContent = `Penalty: +${penaltytime}s`;
  finalTimeEl.textContent = `${finaltimedisplay}s`;
  showscorepage();
}
// stop timer and process the result
function checkplayertime()
{
  if(playeranswerarr.length === questionamount)
  {
    clearInterval(timer);
  }
  equationsArray.forEach((equation , index) =>
    {
      if(equation.evaluated === playeranswerarr[index])
      {

      }
      else{
        penaltytime +=0.5;
      }
    })
    finaltime = timeplayed + penaltytime;
    scoreToDom();
}


// Scroll
let valueY = 0;
// timer for player
function addtime()
{
  timeplayed += 0.1;
  //  to evaluate player time stats 
  checkplayertimes();
}


function timerstart()
{
  timeplayed = 0;
  penaltytime = 0;
  finaltime = 0;
  timer = setInterval(() => {
    addtime();
  }, 100);
  gamePage.removeEventListener('click' , timerstart)
}
// store player selection and store choice in array
function select(guesssedtrue)
{
  console.log(playeranswerarr);
  valueY  = valueY + 80;
  itemContainer.scroll(0,valueY);
  return guesssedtrue ? playeranswerarr.push('true') : playeranswerarr.push('false');
  
}



// get random number 
function getRandomint(max){
  return Math.floor(Math.random() * Math.floor(max));
}

function showgamePage()
{
  gamePage.hidden = false;
  countdownPage.hidden = true;

}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomint(questionamount);
  // Set amount of wrong equations
  const wrongEquations = questionamount - correctEquations;
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomint(9);
    secondNumber = getRandomint(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomint(9);
    secondNumber = getRandomint(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomint(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

function displayequations()
{
  equationsArray.forEach(equation =>
    {
      const item  =  document.createElement('div')
      item.classList.add('item');
      const equationText = document.createElement('h1')
      equationText.textContent = equation.value;
      item.appendChild(equationText);
      itemContainer.appendChild(item);
    })
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  displayequations();
  

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}
// navigate to splash to countdown
function showcountdown()
{
  countdownPage.hidden = false;
  splashPage.hidden = true;
      countdownStart();
      populateGamePage();
      setTimeout(
        showgamePage(), 4000);
}


function countdownStart()
{
  countdown.textContent = "3";
  setTimeout(() => {
    countdown.textContent = "2";
  }, 1000);
  setTimeout(() => {
    countdown.textContent = "1";
  }, 2000);
  setTimeout(() => {
    countdown.textContent = "Go!";
  }, 3000);
}
function getnoofquestion()
{
  let radiovalue;
  radioInputs.forEach(data =>{
    if(data.checked)
    {
      radiovalue = data.value;
      
    }
  })
  return radiovalue;
}

function noofquestions(event){
  questionamount = getnoofquestion();
  event.preventDefault();
  console.log(questionamount)
  if(questionamount){
    showcountdown();
}

}

startForm.addEventListener('click' , ()=>
{
  radioContainers.forEach(item=>
    {
      item.classList.remove('selected-label');
      if(item.children[1].checked)
      {
        item.classList.add('selected-label');

      }
    })
})

startForm.addEventListener('submit' , noofquestions);
gamePage.addEventListener('click' , timerstart)