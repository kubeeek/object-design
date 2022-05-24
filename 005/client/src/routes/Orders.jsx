import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useEffect, useState } from 'react';

import Table from '../components/Table';

export default function Orders({ userId }) {
    const [orders, setOrders] = useState([]);
    const [refresh, setRefresh] = useState(0);

    async function getOrders() {
        console.log(userId);
        const result = await window.fetch(`http://localhost:3001/orders?filter={"where":{"userId":${userId}}}`);
        const parsedResult = await result.json();

        if (result.ok)
            setOrders(parsedResult);
    }

    async function payOrder(order) {
        const result = await window.fetch(`http://localhost:3001/orders/${order.uuid}/pay`,
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json' }
            });

        if (result.ok)
            setRefresh(refresh + 1);
    }

    useEffect(() => {
        getOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh]);

    return (
        <>
            <header className="Section-header">
                Your orders
            </header>
            <div className="Section-container">
                <Table
                    headers={["Order #", "Total price", ""]}
                    body={
                        orders.map((entry, index) =>
                            <tr key={index}
                                className="ProductTable-table-row"
                            >
                                <td>{entry.uuid}</td>
                                <td>${entry.items.map(element => element.price).reduce((a, b) => a + b, 0) / 100}</td>
                                <td>
                                    {entry.paid ? <FontAwesomeIcon icon={faCircleCheck} /> : <button onClick={() => payOrder(entry)}>Pay</button>}
                                </td>
                            </tr>
                        )
                    }
                />
            </div>
        </>
    )
}
