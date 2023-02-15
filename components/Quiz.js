import React from "react"
import {nanoid} from "nanoid"

import Answer from "./Answer"

export default function Quiz(props) {
    const answerArr = props.answers.map(ans => {
        return <Answer
                    key={nanoid()}
                    answer={ans.answer}
                    id={ans.id}
                    on={ans.on}
                    correct={ans.correct}
                    check={ans.check}
                    green={ans.green}
                    red={ans.red}
                    toggle={props.toggle}
                />
    })
    
    return (
        <div className="question-container">
            <h2 className="question">
                {props.question}
            </h2>
            <div className="answers-container">
                {answerArr}
            </div>
        </div>
    )
}