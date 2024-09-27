    // src/components/Wallet.jsx
    import React from 'react';
    import '../styles/Wallet.css';

    const Wallet = () => {
    return (
        <>

        <div className="container-wallet">
            <h6 className="cash">Taxi cash</h6>
            <h1 className="rupee">₹0.00</h1>
            <h5 className="gift">+ Gift Card</h5>
        </div>
        <h4 className="method">Payment Method</h4>
        <div className="overlay1">
            <p>+ Add Payment Method</p>
        </div>
        <h4 className="vocher">Voucher</h4>
        <div className="overlay2">
            <p>+ Add Voucher</p>
        </div>
        </>
    );
    };

    export default Wallet;
