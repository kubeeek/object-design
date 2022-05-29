import { Link, Outlet } from "react-router-dom";
import "../css/Layout.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'


export default function Layout({ cartEntriesCount }) {
    return (
        <>
            <nav className="Layout-nav">
                <ul>
                    <li className="Layout-nav-link">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="Layout-nav-link">
                        <Link to="/orders">
                            Orders
                        </Link>
                    </li>
                    <li className="Layout-nav-link">
                        <Link to="/contact">
                            Contact
                        </Link>
                    </li>
                    <li className="Layout-nav-link">
                        <Link to="/cart">
                            <FontAwesomeIcon icon={faShoppingCart} />
                            {cartEntriesCount > 0 &&
                                <span className="Layout-nav-link-count">{cartEntriesCount}</span>
                            }
                        </Link>
                    </li>
                </ul>
            </nav>

            <Outlet />
        </>
    );
}