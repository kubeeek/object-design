import React from 'react'
import './Table.css'

export default function ProductTable({ headers = [], body }) {
    return (
        <>
            <table className="ProductTable-table">
                <thead>
                    <tr>
                        {headers.map(header => <th>{header}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {body}
                </tbody>
            </table>
        </>
    )
}
