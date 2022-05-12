import { useNavigate } from "react-router-dom";

import CartSummary from "../components/CartSummary";

export default function Cart({ CartTable, cart, userId, onOrderButtonCallback }) {
    const navigate = useNavigate();

    const placeOrder = async (cart) => {
        const items = {};

        cart.forEach(element => {
            if (element.id in items)
                return items[element.id]++;

            items[element.id] = 1;
        });

        console.log(JSON.stringify({
            userId,
            items,
        }))
        const result = await window.fetch("http://localhost:3001/orders", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                userId,
                items,
            })
        })

        if (result.ok) {
            navigate("/orders");
            onOrderButtonCallback();
        }
    };

    return (
        <>
            <header className="Section-header">
                Your cart
            </header>
            {cart.length > 0 && <div className="Section-container">{CartTable}</div>}
            <div className="Section-container">
                {cart.length > 0
                    ? <CartSummary cart={cart} onClickCallback={placeOrder} />
                    : <p>There is nothing in your cart at the moment</p>
                }

            </div>
        </>
    );
}