
const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const PostList = (props) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const loadPostsFromServer = async () => {
            const response = await fetch('/getUserPosts');
            const data = await response.json();
            setPosts(data.posts);
        };

        loadPostsFromServer(); }, []);

    if (posts.length === 0) {
        return (
            <div className='PostList'>
                <h3 className="emptyPost">No Posts Yet!</h3>
            </div>
        );
    }

    const postNodes = posts.map(post => {
        return (
            <div key={post._id} className='post'>
                <img src="/assets/img/postface.jpeg" alt="post face" className='postFace' />
                <h3 className='postName'>Name: {post.name}</h3>
                <h3 className='postAge'>Age: {post.age}</h3>
            </div>
        );
    });

    return (
        <div className='postList'>
            {postNodes}
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
            <div id="posts">
                <h2>My Posts</h2>
                <PostList />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('account'));
    root.render(<Account />);
};

window.onload = init;
