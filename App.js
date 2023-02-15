import React from "react"
import {nanoid} from "nanoid"

import Quiz from "./components/Quiz"

export default function App() {
    const [quiz, setQuiz] = React.useState("start")
    const [newQuiz, setNewQuiz] = React.useState(false)
    const [quizData, setQuizData] = React.useState([])
    const [score, setScore] = React.useState(0)
    
    React.useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=5&type=multiple")
            .then(res => res.json())
            .then(data => setQuizData(data.results.map(obj => replaceExp(obj))))
    }, [newQuiz])
        
    function setQuizStatus() {
        setQuiz(prev => {
            if (prev === "start") {
                return "play"
            }
            else if (prev === "play") {
                return "check"
            }
            else {
                return "play"
            }
        })
    }
    
    function getNewQuiz() {
        setNewQuiz(prev => !prev)
        setScore(prev => 0)
    }
    
    function toggle(id) {
        setQuizData(prev => {
            return prev.map(obj => {
                const answers = obj.answers
                for (var i = 0; i < answers.length; i++) {
                    if (answers[i].id === id) {
                        const newArr = answers.map(ans => {
                            return ans.id === answers[i].id
                            ?
                            {...ans, on: !ans.on}
                            :
                            {...ans}
                        })
                        return {...obj, answers: newArr}
                    }
                }
                return {...obj}
            })
        })
    }
    
    function checkAnswers() {
        setQuizData(prev => {
            return prev.map(obj => {
                var correct = 0
                var incorrect = 0
                const answers = obj.answers
                const answersMap = answers.map(ans => {
                    if (ans.correct && ans.on) {
                        correct++
                        return {...ans, check: true, green: true}
                    }
                    else if (ans.correct && !ans.on) {
                        return {...ans, check: true, green: true}
                    }
                    else if (!ans.correct && ans.on) {
                        incorrect++
                        return {...ans, check: true, red: true}
                    }
                    else {
                        return {...ans, check: true}
                    }
                })
                if (correct > incorrect) {
                    setScore(prev => prev + 1)
                }
                return {...obj, answers: answersMap}
            })
        })
    }
    
    const quizArray = quizData.map(obj => {
        return <Quiz
                    key={nanoid()}
                    question={obj.question}
                    answers={obj.answers}
                    toggle={toggle}
                />
    })
    
    return (
        <main>
            {
                quiz === "start"
                &&
                <div className="start-container">
                    <h1 className="title">Quizzical</h1>
                    <h3 className="description">It's not "useless" knowledge</h3>
                    <button className="quiz-btn" onClick={setQuizStatus}>
                        Start quiz
                    </button>
                </div>
            }
            {
                quiz === "play"
                &&
                <div>
                    {quizArray}
                    <div className="button-div">
                        <button className="quiz-btn" onClick={() => {setQuizStatus(); checkAnswers()}}>
                            Check answers
                        </button>
                    </div>
                </div>
            }
            {
                quiz === "check"
                &&
                <div>
                    {quizArray}
                    <div className="button-div">
                        <p className="score-text">You scored {score}/5 correct answers</p>
                        <button className="quiz-btn" onClick={() => {setQuizStatus(); getNewQuiz()}}>
                            Play again
                        </button>
                    </div>
                </div>
            }
        </main>
    )
    
    /*
        Helper function:
            Replaces (most) JSON expressions with corresponding characters.
            Takes in API data and returns an object of format {question="", answers=[]}
            Randomizes answers array using Durstenfeld shuffle algorithm
    */
    function replaceExp(obj) {
        const allAnswers = obj.incorrect_answers.map(ans => {
            return {
                        answer: ans
                                .replace(/&quot;/g, '\"')
                                .replace(/&eacute;/g, "é")
                                .replace(/&Eacute;/g, "É")
                                .replace(/&#039;/g, "′")
                                .replace(/&rsquo;/g, "'")
                                .replace(/&deg;/g, "°")
                                .replace(/&amp;/g, "&"),
                        id: nanoid(),
                        correct: false,
                        on: false,
                        check: false,
                        green: false,
                        red: false
                    }
        })
        const correct = {
                            answer: obj.correct_answer
                                    .replace(/&quot;/g, '\"')
                                    .replace(/&eacute;/g, "é")
                                    .replace(/&Eacute;/g, "É")
                                    .replace(/&#039;/g, "′")
                                    .replace(/&rsquo;/g, "'")
                                    .replace(/&deg;/g, "°")
                                    .replace(/&amp;/g, "&"),
                            id: nanoid(),
                            correct: true,
                            on: false,
                            check: false,
                            green: false,
                            red: false
                        }
        allAnswers.splice(Math.floor(Math.random()*4), 0, correct)
        
        // Durstenfeld shuffle algorithm, referenced from:
        // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
        for (var i = allAnswers.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = allAnswers[i];
            allAnswers[i] = allAnswers[j];
            allAnswers[j] = temp;
        }
        
        return {
            question: obj.question
                        .replace(/&quot;/g, '\"')
                        .replace(/&eacute;/g, "é")
                        .replace(/&Eacute;/g, "É")
                        .replace(/&#039;/g, "'")
                        .replace(/&rsquo;/g, "'")
                        .replace(/&deg;/g, "°")
                        .replace(/&amp;/g, "&"),
            answers: allAnswers
        }
    }
}