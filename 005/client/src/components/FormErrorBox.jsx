import React from 'react'

export default function FormErrorBox({ errors }) {
    return (
        <>
            {Object.values(errors).map((error, index) => {
                return error !== '' ? <div className="Layout-error-box" key={index}>{error}</div> : ''
            })}
        </>
    )
}
