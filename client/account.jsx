
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

//change passworod from current password
const ChangePasswordForm = () => {
    const handleChangePassword = (e) => {
        e.preventDefault();
        helper.hideError();

        const oldPassword = e.target.querySelector('#oldPassword').value;
        const newPassword = e.target.querySelector('#newPassword').value;
        const confirmPassword = e.target.querySelector('#confirmPassword').value;

        if (!oldPassword || !newPassword || !confirmPassword) {
            helper.handleError('All Fields Required');
            return false;
        }
        if(oldPassword == newPassword){
            helper.handleError('new password cant be old password');
            return false;
        }

        if (newPassword !== confirmPassword) {
            helper.handleError('NEW passwords do not match!');
            return false;
        }

        helper.sendPost(e.target.action, {
            oldPassword,
            newPassword,
            confirmPassword
        });

        return false;
    };

    return (
        <form id="changePasswordForm" onSubmit={handleChangePassword} action="/changePassword" method="POST" className="mainForm">
            <h2>Change Password</h2>
            <label htmlFor="oldPassword">Current Password:</label>
            <input id="oldPassword" type="password" placeholder="Current password"/>

            <label htmlFor="newPassword">New Password:</label>
            <input id="newPassword" type="password" placeholder="New password"/>

            <label htmlFor="confirmPassword">Confirm New Password:</label>
            <input id="confirmPassword" type="password" placeholder="Confirm new password"/>

            <input className="formSubmit" type="submit" value="Change Password"/>
        </form>
    );
};

// change password from security question
const SecurityResetForm = () => {
    const [securityQuestion, setSecurityQuestion] = useState('');

    useEffect(() => {
        const loadSecurityQuestion = async () => {
            try {
                const response = await fetch('/getSecurityQuestion');
                const data = await response.json();

                if (response.ok) {
                    setSecurityQuestion(data.securityQuestion);
                } else {
                    helper.handleError(data.error || 'Error security question');
                }
            } catch (err) {
                helper.handleError('Could not load');
            }
        };

        loadSecurityQuestion();
    }, []);

    const handleResetPassword = (e) => {
        e.preventDefault();
        helper.hideError();

        const securityAnswer = e.target.querySelector('#securityAnswer').value;
        const newPassword = e.target.querySelector('#resetNewPassword').value;
        const confirmPassword = e.target.querySelector('#resetConfirmPassword').value;

        if (!securityAnswer || !newPassword || !confirmPassword) {
            helper.handleError('All Fields Required!');
            return false;
        }

        if (newPassword !== confirmPassword) {
            helper.handleError('New passwords do not match!');
            return false;
        }

        helper.sendPost(e.target.action, {
            securityAnswer,
            newPassword,
            confirmPassword
        });

        return false;
    };

    return (
        <form id="securityResetForm" onSubmit={handleResetPassword} action="/resetPassword" method="POST" className="mainForm">
            <h2>Reset Password</h2>
            <h3>Security Question:</h3>
            <p>{securityQuestion || 'give it a moment'}</p>

            <label htmlFor="securityAnswer">Security Answer:</label>
            <input id="securityAnswer" type="text" placeholder="Your answer"/>

            <label htmlFor="resetNewPassword">New Password:</label>
            <input id="resetNewPassword" type="password" placeholder="New password"/>

            <label htmlFor="resetConfirmPassword">Confirm New Password:</label>
            <input id="resetConfirmPassword" type="password" placeholder="Confirm new password"/>

            <input className="formSubmit" type="submit" value="Reset Password" />
        </form>
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
    const [selectedForm, setSelectedForm] = useState('change');

    return (
        <div>
            <AccountInfo />
            <div id="passwordSection">
                <h2>Password Settings</h2>

                <button type="button" className="formSubmit" onClick={() => setSelectedForm('change')}> Change Password</button>

                <button type="button" className="formSubmit" onClick={() => setSelectedForm('security')}> Forgot password</button>

                {selectedForm === 'change' ? (
                    <ChangePasswordForm />
                ) : (
                    <SecurityResetForm />
                )}
            </div>

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
