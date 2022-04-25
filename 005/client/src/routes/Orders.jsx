import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useEffect, useState } from 'react';

import Table from '../components/Table';

export default function Orders({ userId }) {
    const [orders, setOrders] = useState([]);
    const [refresh, setRefresh] = useState(0);
    console.log(userId);

    async function getOrders() {
        console.log(userId);
        const result = await window.fetch(`http://localhost:3001/orders?filter={"where":{"userId":${userId}}}`);
        const orders = await result.json();

        if (result.ok)
            setOrders(orders);
    };

    async function payOrder(order) {
        const result = await window.fetch(`http://localhost:3001/orders/${order.uuid}/pay`,
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json' }
            });

        if (result.ok)
            setRefresh(refresh + 1);
    };

    useEffect(() => {
        getOrders();
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
                        orders.map(entry =>
                            <tr key={entry.uuid}
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
