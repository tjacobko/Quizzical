import React from "react"

export default function Answer(props) {
    if (props.check) {
        if (props.green) {
            var styles = {
                backgroundColor: "#94D7A2"
            }
        }
        else if (props.red) {
            var styles = {
                backgroundColor: "#F8BCBC"
            }
        }
        else {
            var styles = {
                backgroundColor: "transparent",
                opacity: 0.5
            }
        }
    }
    else {
        var styles = {
            backgroundColor: props.on ? "#D6DBF5" : "transparent"
        }
    }
    
    return (
        <button
            style={styles}
            className="answer"
            onClick={()=>props.toggle(props.id)}
        >
            {props.answer}
        </button>
    )
}