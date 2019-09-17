// Array of random indicies for trivia array 
let questionIndices = []
// Current index in questionIndices
let currentIndex = 0
let timer
let time = 30
let correct = 0
let incorrect = 0
let unanswered = 0

// Randomize elements of array
const randomizeArray = arr => {
    let currInd = arr.length
    let temp
    let randInd
    while (currInd > 0) {
        randInd = Math.floor(Math.random() * (currInd - 0.0001))
        currInd--
        temp = arr[currInd]
        arr[currInd] = arr[randInd]
        arr[randInd] = temp
    }
    return arr
}

// Start game
const startGame = _ => {
    console.log('running resetGame')
    // Randomly choose the indices for the questions in the trivia array
    while (questionIndices.length < 10) {
        let newIndex = Math.floor(Math.random() * (trivia.length - 0.0001))
        !questionIndices.includes(newIndex) ? questionIndices.push(newIndex) : ''
    }
    time = 30
    currentIndex = 0
    correct = 0
    incorrect = 0
    nextQuestion()
    addAllListeners()
    startTimer()
}


// Adds elements for question screen
const questionScreen = _ => {
    document.querySelector('body').innerHTML = `
        <div id="container" class="grid-y">
            <div class="cell text-center">
                <h1>Trivia Title</h1>
            </div>
            <div class="grid-x grid-padding-x align-center">
                <div id="timer-label" class="large-6 medium-6 small-6 cell text-right">
                    <h3>Time Remaining: </h3>
                </div>  
                <div id="timer" class="large-6 medium-6 small-6 cell text-left">
                    <h3>30 Seconds</h3>
                </div>
            </div>
            <div id="question-container" class="grid-x align-center">
                <div id="question" class="large-6 medium-8 small-12 cell text-center"><h2>Why?</h2></div>
            </div>
            <div id="answers-container" class="grid-x align-center">
                <div class="large-6 medium-6 small-12 cell text-center">
                    <ol id="answer-list">
                        <li id="answer-0" class="answer">None</li>
                        <li id="answer-1" class="answer">None</li>
                        <li id="answer-2" class="answer">None</li>
                        <li id="answer-3" class="answer">None</li>
                    </ol>
                </div>
            </div>
        </div>`
}

const answerScreen = (status) => {
    // Remove countdown
    clearInterval(timer)
    time = 30
    // Add elements for answer screen
    document.querySelector('body').innerHTML = `
        <div id="container" class="grid-y">
            <div class="cell text-center">
                <h1>Trivia Title</h1>
            </div>
            <div class="grid-y grid-padding-y align-center">
                <div id="status-label" class="large-6 medium-6 small-6 cell text-center">
                </div>  
                <div id="correct-label" class="large-6 medium-6 small-6 cell text-center">
                </div>
            </div>
        </div>`
    // Change display and increment variable based on status of question 
    switch (status) {
        case 'correct':
            document.querySelector('#status-label').innerHTML = '<h3>You are correct!</h3>'
            correct++
            break
        case 'incorrect':
            document.querySelector('#status-label').innerHTML = '<h3>You guessed incorrectly!</h3>'
            document.querySelector('#correct-label').innerHTML = `<h3>The correct answer is: ${trivia[questionIndices[currentIndex]].correct_answer}</h3>`
            incorrect++
            break
        case 'time':
            document.querySelector('#status-label').innerHTML = '<h3>You ran out of time!</h3>'
            document.querySelector('#correct-label').innerHTML = `<h3>The correct answer is: ${trivia[questionIndices[currentIndex]].correct_answer}</h3>`
            unanswered++
            break
        default:
            break
    }
    // Increment index for current question
    currentIndex++
    // Wait 3 seconds before next question
    setTimeout(_ => {
        // Check if finished 10 questions
        if (currentIndex < 10) {
            // Not finished so go to next question
            nextQuestion()
            addAllListeners()
            startTimer()
        } else {
            // Finished
            console.log('end game')
            endGame()
        }
    }, 3000)
}

const nextQuestion = _ => {
    console.log('running nextQuestion')
    questionScreen()
    // Select next question from randomized indices(questionIndices) using currentIndex
    let currentQuestion = trivia[questionIndices[currentIndex]]
    // Display current question
    document.querySelector('#question').innerHTML = `<h4>${currentQuestion.question}</h4>`
    // Randomize displayed answers
    let answerIndices = randomizeArray([0, 1, 2, 3])
    for (let i = 0; i < answerIndices.length; i++) {
        // If answer index is 0 then display correct answer, otherwise display the answer at index answerIndices[i]-1 in incorrect_answers
        document.querySelector(`#answer-${i}`).textContent = !answerIndices[i] ? currentQuestion.correct_answer : currentQuestion.incorrect_answers[answerIndices[i]-1]
    }
}

// Highlight answer on mouseover
const mouseOverAnswer = event => {
    event.target.style.backgroundColor = 'red'
    event.target.style.color = 'white'
}

// Un-highlight answer on mouseout
const mouseOutAnswer = event => {
    event.target.style.backgroundColor = 'white'
    event.target.style.color = 'black'
}

// Go to answer screen with parameter based on if answer is correct
const clickAnswer = event => answerScreen(trivia[questionIndices[currentIndex]].incorrect_answers.includes(event.target.textContent) ? 'incorrect' : 'correct')

// Remove event listeners for answers
const clearAllListeners = _ => {
    let answers = document.getElementsByClassName('answer')
    for (let i = 0; i < answers.length; i++) {
        answers[i].removeEventListener('mouseover', mouseOverAnswer)
        answers[i].removeEventListener('mouseout', mouseOutAnswer)
        answers[i].removeEventListener('click', clickAnswer)
    }
}

// Add event listeners for answers
const addAllListeners = _ => {
    let answers = document.getElementsByClassName('answer')
    for (let i = 0; i < answers.length; i++) {
        answers[i].addEventListener('mouseover', mouseOverAnswer)
        answers[i].addEventListener('mouseout', mouseOutAnswer)
        answers[i].addEventListener('click', clickAnswer)
    }
}

// Start 30 second timer for question
const startTimer = _ => {
    console.log('running startTimer')
    timer = setInterval(_ => {
        if (time > 1) {
            // Decrement time and display
            time--
            document.querySelector('#timer').innerHTML = `<h3>${time} Seconds</h3>`
        } else {
            // Time ran out so go to answer screen
            answerScreen('time')
        }
    }, 1000)
}

// Display results of game
const endGame = _ => document.querySelector('body').innerHTML = `
        <div id="container" class="grid-y">
            <div class="cell text-center">
                <h1>Trivia Title</h1>
            </div>
            <div class="grid-x grid-padding-x align-center">
                <div id="correct-label" class="large-6 medium-6 small-6 cell text-right">
                    <h3>Correct: </h3>
                </div>
                <div id="correct" class="large-6 medium-6 small-6 cell text-left">
                    <h3>${correct}</h3>
                </div>
            </div>
            <div class="grid-x grid-padding-x align-center">
                <div id="incorrect-label" class="large-6 medium-6 small-6 cell text-right">
                    <h3>Incorrect: </h3>
                </div>
                <div id="incorrect" class="large-6 medium-6 small-6 cell text-left">
                    <h3>${incorrect}</h3>
                </div>
            </div>
            <div class="grid-x grid-padding-x align-center">
                <div id="unanswered-label" class="large-6 medium-6 small-6 cell text-right">
                    <h3>Unanswered: </h3>
                </div>
                <div id="unanswered" class="large-6 medium-6 small-6 cell text-left">
                    <h3>${unanswered}</h3>
                </div>
            </div>
            <div class="grid-x" align-center>
                <div class="large-6 medium-6 small-6 cell text-center">
                    <button id="start-btn" class="button secondary medium-down-expanded">Play Again?</button>
                </div>
            </div>
        </div>`

// Add event listener for the start game button
document.querySelector('body').addEventListener('click', event => event.target.id === 'start-btn' ? startGame() : '')