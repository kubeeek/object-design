import React from 'react'

import Table from './Table';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus, faBan } from '@fortawesome/free-solid-svg-icons'

export default function ProductTable({ content, onClickCallback, type = 'add' }) {
    return (
        <>
            <Table
                headers={['Name', 'Price', '']}
                body={
                    content.map((entry, index) =>
                        <tr key={index}
                            className="TableComponent-table-row"
                        >
                            <td>{entry.name}</td>
                            <td>${entry.price / 100}</td>
                            <td>
                                {type === 'add' && <FontAwesomeIcon className="hoverable" icon={faCartPlus} onClick={() => onClickCallback(entry)} />}
                                {type === 'remove' && <FontAwesomeIcon className="hoverable" icon={faBan} onClick={() => onClickCallback(entry)} />}
                            </td>
                        </tr>
                    )
                }
            />
        </>
    )
}
