const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');

//list of security questions
const securityQuestions = [
    "What is your favoirte fish?",
    "What is your favorite city?",
    "What was your favorite nickname?",
    "What movie do you hate?",
    "How old were you when you lost your first tooth?",
    "What was your first concert?",
    "What was the best food your parents make?",
    "What was the name of your first friend?"
];

const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if (!username || !pass) {
        helper.handleError('username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, { username, pass });
    return false;
}

const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;
    const displayName = e.target.querySelector('#displayName').value;
    const securityQuestion = e.target.querySelector('#securityQuestion').value;
    const securityAnswer = e.target.querySelector('#securityAnswer').value

    if (!username || !pass || !pass2 || !displayName || !securityQuestion || !securityAnswer) {
        helper.handleError("All Fields Required!");
        return false;
    }

    helper.sendPost(e.target.action, { username, pass, pass2, displayName, securityQuestion, securityAnswer });

    return false;
}

const LoginWindow = (props) => {
    return (
        <form id="loginForm"
            name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor='pass'>Password: </label>
            <input id="pass" type="password" name='pass' placeholder='password' />
            <input className='formSubmit' type='submit' value='Sign in' />

        </form>
    );
};

const SignupWindow = (props) => {
    return (
        <form id='signupForm'
            name='signupForm'
            onSubmit={handleSignup}
            action="/signup"
            method='POST'
            className='mainForm'
        >
            <label htmlFor="username">Username: </label>
            <input id='user' type='text' name='username' placeholder='username' />
            <label htmlFor="displayName">Display Name: </label>
            <input id='displayName' type='text' name='displayName' placeholder='display name' />
            <label htmlFor="pass">Password: </label>
            <input id='pass' type='password' name='pass' placeholder='password' />
            <label htmlFor='pass'>Password: </label>
            <input id='pass2' type='password' name='pass2' placeholder='retype password' />
            <label htmlFor="securityQuestion">Choose a Security Question:</label>
            <select id="securityQuestion" name="securityQuestion" defaultValue="">
                {/* Lets you pick from multiple question options */}
                <option value="" disabled>Select question</option>
                {securityQuestions.map((question, index) => (
                    <option key={index} value={question}>
                        {question}
                    </option>))}
            </select>
            <label htmlFor="securityAnswer"> Security Answer: </label>
            <input id="securityAnswer" type="text" name="securityAnswer" placeholder="answer"/>
            <input className='formSubmit' type='submit' value="Sign up" />

        </form>
    );
};

const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    const root = createRoot(document.getElementById('content'));

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<LoginWindow />);
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<SignupWindow />);
        return false;
    });

    root.render(<LoginWindow />);
};

window.onload = init;