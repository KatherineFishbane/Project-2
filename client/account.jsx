
const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const DomoList = (props) => {
    const [domos, setDomos] = useState([]);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getUserDomos');
            const data = await response.json();
            setDomos(data.domos);
        };

        loadDomosFromServer(); }, []);

    if (domos.length === 0) {
        return (
            <div className='domoList'>
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = domos.map(domo => {
        return (
            <div key={domo._id} className='domo'>
                <img src="/assets/img/domoface.jpeg" alt="domo face" className='domoFace' />
                <h3 className='domoName'>Name: {domo.name}</h3>
                <h3 className='domoAge'>Age: {domo.age}</h3>
            </div>
        );
    });

    return (
        <div className='domoList'>
            {domoNodes}
        </div>
    );
};

const AccountInfo = () => {
    const [account, setAccount] = useState(null);

    useEffect(() => {
        const loadAccountFromServer = async () => {
            const response = await fetch('/getAccount');
            const data = await response.json();
            setAccount(data.account);
        };

        loadAccountFromServer();
    }, []);

    if (!account) {
        return <h3>Error with Accouint</h3>;
    }

    return (
        <div className='accountInfo'>
            <h2>Display Name: {account.displayName || 'No Display Name'}</h2>
            <h3>Username: {account.username}</h3>
        </div>
    );
};

const Account = () => {
    return (
        <div>
            <AccountInfo />
            <div id="domos">
                <h2>My Domos</h2>
                <DomoList />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('account'));
    root.render(<Account />);
};

window.onload = init;
