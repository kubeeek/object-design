import React, { useState, useEffect } from 'react'

function CartSummary({ cart, onClickCallback }) {
    const [prices, setPrice] = useState([])

    useEffect(() => {
        const pricesArray = cart.map(element => element.price);

        setPrice(pricesArray);
    }, [cart])


    return (
        <div>
            <p>Total products: {cart.length}</p>
            <p>Total cost: {'$' + prices.reduce((a, b) => a + b, 0) / 100}</p>
            <button onClick={() => onClickCallback(cart)}>Place an order</button>
        </div>
    )
}

export default CartSummary
