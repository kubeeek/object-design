import React, { useState, useReducer } from 'react'

import FormErrorBox from '../components/FormErrorBox';

function setFormErrors(state, payload) {
    return {
        ...state,
        ...payload
    }
}

const initialErrors = { email: '', topic: '', text: '' };

export default function Contact() {
    const [submission, setSubmission] = useState({ email: '', topic: '', text: '' })
    const [formValid, setFormValid] = useState(false);
    const [formErrors, dispatchFormErrors] = useReducer(setFormErrors, initialErrors)
    const [sent, setSent] = useState(false);

    function onSubmitEvent(ev) {
        ev.preventDefault()
        dispatchFormErrors(initialErrors)
        let error = false;

        if (submission.topic.length < 3) {
            setFormValid(false)
            error = true;
            dispatchFormErrors({ topic: "Topic too short or empty" })
        }

        if (submission.email.length < 3 /*isEmail(submission.email)*/) {
            setFormValid(false)
            error = true;

            dispatchFormErrors({ email: "Email invalid" })
        }

        if (submission.text.length < 32) {
            setFormValid(false)
            error = true;

            dispatchFormErrors({ text: "Message too short or empty" })
        }

        if (!error)
            submit()
    }

    function submit() {
        setSent(true)
    }

    return (
        <>
            <header className="Section-header">
                Contact form
            </header>
            <div className="Section-container">
                {!Object.values(formErrors).every(val => val === '') && <FormErrorBox errors={formErrors} />}
                {sent && <div>Form sent</div>}
                <form onSubmit={onSubmitEvent} onInput={() => { setFormValid(true) }}>
                    <div>
                        <label htmlFor="topic">Topic</label>
                        <input type="text" name="topic" id="topic" value={submission.topic}
                            onChange={(e) => setSubmission({ ...submission, topic: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" value={submission.email}
                            onChange={(e) => setSubmission({ ...submission, email: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="text">Your message</label>
                        <textarea name="text" id="text" value={submission.text}
                            onChange={(e) => setSubmission({ ...submission, text: e.target.value })} />
                    </div>
                    <div>
                        <button disabled={!formValid}>Submit</button>
                    </div>
                </form>
            </div>
        </>
    )
}
