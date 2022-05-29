import { Routes, Route } from "react-router-dom";
import React, { useState, useEffect, useReducer } from 'react'

import ProductTable from './components/ProductTable';

import Home from "./routes/Home";
import Layout from "./routes/Layout";
import Cart from "./routes/Cart";
import Orders from "./routes/Orders";
import Contact from "./routes/Contact";

import NoMatch from "./routes/NoMatch";

function cartReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, action.data];
    case 'remove': {
      const update = [...state];
      update.splice(update.indexOf(action.data), 1);
      return update;
    }
    case 'clear':
      return [];
    default:
      return state;
  }
}

function App() {
  const userId = 2122;
  const [cart, setCart] = useReducer(cartReducer, []);
  const [services, setServices] = useState([]);

  async function fetchData(setter) {
    const result = await fetch("http://localhost:3001/services");
    const parsedResult = await result.json();

    return setter(parsedResult);
  }

  function onProductSelected(product) {
    setCart({ data: product, type: 'add' });
  }

  function onCartItemSelected(product) {
    setCart({ data: product, type: 'remove' });
  }

  function onOrderButtonClick() {
    setCart({ type: 'clear' });
  }

  useEffect(() => {
    fetchData(setServices);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout cartEntriesCount={cart.length} />}>
          <Route index
            element={
              <Home
                ProductTable=
                {services.length === 0
                  ? <p>No services available at the moment</p>
                  : <ProductTable content={services} type={"add"}
                    onClickCallback={onProductSelected} />}
              />
            }
          />
          <Route path="cart" element={<Cart userId={userId} onOrderButtonCallback={onOrderButtonClick} CartTable={<ProductTable content={cart} type={"remove"} onClickCallback={onCartItemSelected} />} cart={cart} />} />
          <Route path="orders" element={<Orders userId={userId} />} />
          <Route path="contact" element={<Contact />} />

          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>


    </div>
  );
}

export default App;
