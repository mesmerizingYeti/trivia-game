let questionIndices = []
let timer
let time = 30
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

const resetGame = _ => {
    console.log('running resetGame')
    questionIndices = randomizeArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    time = 30
    currentIndex = 0
    correct = 0
    incorrect = 0
    nextQuestion()
    addAllListeners()
    startTimer()
}

const nextQuestion = _ => {
    console.log('running nextQuestion')
    // setup next question and answers
    let currentTarget = trivia[questionIndices[currentIndex]]

    console.log(`currentTarget = ${JSON.stringify(currentTarget)}`)

    document.querySelector('#question').innerHTML = `<h4>${currentTarget.question}</h4>`
    let answerIndices = randomizeArray([0, 1, 2, 3])
    console.log(answerIndices)
    for (let i = 0; i < answerIndices.length; i++) {

        console.log(`answerIndices[i] = ${answerIndices[i]}`)
        console.log(`!answerIndices[i] = ${!answerIndices[i]}`)

        let tempText = document.querySelector(`#answer-${answerIndices[i]}`).textContent

        console.log(`textContent = ${tempText}`)

        if (answerIndices[i] === 3) {
            document.querySelector(`#answer-${answerIndices[i]}`).textContent = currentTarget.correct_answer
            console.log(`correct = ${currentTarget.correct_answer}`)
        } else {
            document.querySelector(`#answer-${answerIndices[i]}`).textContent = currentTarget.incorrect_answers[answerIndices[i]]
            console.log(`${currentTarget.incorrect_answers}`)
            console.log(answerIndices[i])
            console.log(`incorrect = ${currentTarget.incorrect_answers[answerIndices[i]]}`)
        }
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
        if (time > 0) {
            time--
            document.querySelector('#timer').innerHTML = `<h3>${time} Seconds</h3>`
        } else {
            unanswered++
            console.log('time ran out')
            clearInterval(timer)
            // Run time ran out option
        }
    }, 1000)
}

resetGame()