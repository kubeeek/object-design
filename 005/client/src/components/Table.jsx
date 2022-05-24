import React from 'react'
import './Table.css'

export default function Table({ headers = [], body }) {
    return (
        <>
            <table className="TableComponent-table">
                <thead>
                    <tr>
                        {headers.map((header, index) => <th key={index}>{header}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {body}
                </tbody>
            </table>
        </>
    )
}
