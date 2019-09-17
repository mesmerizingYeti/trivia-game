let questionIndices = []
let timer
let time = 3000
let currentIndex = 0
let correct = 0
let incorrect = 0
let unanswered = 0

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

const restartGame = _ => {
    console.log('running resetGame')
    questionIndices = randomizeArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    time = 3000
    currentIndex = 0
    correct = 0
    incorrect = 0
    nextQuestion()
    addAllListeners()
    startTimer()
}


// Adds elements for question screen
const questionScreen = _ => {
    currentIndex > 0 ? document.querySelector('body').removeChild(document.querySelector('#container')) : ''
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
    clearInterval(timer)
    time = 3000
    document.querySelector('body').removeChild(document.querySelector('#container'))
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
    switch (status) {
        case 'correct':
            document.querySelector('#status-label').innerHTML = '<h3>You are correct!</h3>'
            break
        case 'incorrect':
            document.querySelector('#status-label').innerHTML = '<h3>You guessed incorrectly!</h3>'
            document.querySelector('#correct-label').innerHTML = `<h3>The correct answer is: ${trivia[questionIndices[currentIndex]].correct_answer}</h3>`
            break
        case 'time':
            document.querySelector('#status-label').innerHTML = '<h3>You ran out of time!</h3>'
            document.querySelector('#correct-label').innerHTML = `<h3>The correct answer is: ${trivia[questionIndices[currentIndex]].correct_answer}</h3>`
            break
        default:
            break
    }
    currentIndex++
    setTimeout(_ => {
        if (currentIndex < questionIndices.length) {
            nextQuestion()
            addAllListeners()
            startTimer()
        } else {
            console.log('End game')
            endGame()
        }
    }, 3000)
}

const nextQuestion = _ => {
    console.log('running nextQuestion')
    questionScreen()
    // setup next question and answers
    let currentTarget = trivia[questionIndices[currentIndex]]

    document.querySelector('#question').innerHTML = `<h4>${currentTarget.question}</h4>`
    let answerIndices = randomizeArray([0, 1, 2, 3])
    for (let i = 0; i < answerIndices.length; i++) {
        let tempText = document.querySelector(`#answer-${answerIndices[i]}`).textContent

        document.querySelector(`#answer-${i}`).textContent = !answerIndices[i] ? currentTarget.correct_answer : currentTarget.incorrect_answers[answerIndices[i]-1]
    }
}

const mouseOverAnswer = event => {
    event.target.style.backgroundColor = 'red'
    event.target.style.color = 'white'
}

const mouseOutAnswer = event => {
    event.target.style.backgroundColor = 'white'
    event.target.style.color = 'black'
}

const clickAnswer = event => {
    console.log(trivia[questionIndices[currentIndex]].incorrect_answers.includes(event.target.textContent) ?
        'Wrong' : 'Right')
    if (trivia[questionIndices[currentIndex]].incorrect_answers.includes(event.target.textContent)) {
        incorrect++
        // Go to show video screen
        // Wrong answer, the correct answer was ...
        answerScreen('incorrect')
    } else {
        correct++
        // Go to show video screen
        // Correct!
        answerScreen('correct')
    }
}

const clearAllListeners = _ => {
    let answers = document.getElementsByClassName('answer')
    for (let i = 0; i < answers.length; i++) {
        answers[i].removeEventListener('mouseover', mouseOverAnswer)
        answers[i].removeEventListener('mouseout', mouseOutAnswer)
        answers[i].removeEventListener('click', clickAnswer)
    }
}

const addAllListeners = _ => {
    let answers = document.getElementsByClassName('answer')
    console.log(answers)
    for (let i = 0; i < answers.length; i++) {
        answers[i].addEventListener('mouseover', mouseOverAnswer)
        answers[i].addEventListener('mouseout', mouseOutAnswer)
        answers[i].addEventListener('click', clickAnswer)
    }
}

const startTimer = _ => {
    console.log('running startTimer')
    timer = setInterval(_ => {
        if (time > 1) {
            time--
            document.querySelector('#timer').innerHTML = `<h3>${time} Seconds</h3>`
        } else {
            unanswered++
            console.log('time ran out')
            // Run time ran out option
            // Go to show video screen
            // You ran out of time. The correct answer was ...
            answerScreen('time')
        }
    }, 1000)
}

const endGame = _ => {
    document.querySelector('body').removeChild(document.querySelector('#container'))
    document.querySelector('body').innerHTML = `
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
                    <button id="restart-btn" class="button secondary medium-down-expanded>Play Again?</button>
                </div>
            </div>
        </div>
    `
}

document.querySelector('body').addEventListener('click', event => {
    console.log(event)
    event.target.id === 'restart-btn' ? restartGame() : ''
})