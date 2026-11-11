const helper = require('./helper.js');
const React = require('react');
const{ useState, useEffect} = React;
const { createRoot } = require('react-dom/client');

const handlePost = (e, onPostAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#postName').value;
    const age = e.target.querySelector('#postAge').value;

    if(!name || !age){
        helper.handleError('All Fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {name,age}, onPostAdded);
    return false;
}

const PostForm = (props) => {
    return(
        <form id="postForm"
        onSubmit={(e) => handlePost(e,props.triggerReload)}
        name="postForm"
        action="/maker"
        method='POST'
        className='postForm'
        >
            <label htmlFor='name'>Name: </label>
            <input id='postName' type='text' name='name' placeholder='Post Name' />
            <label htmlFor='age'>Age: </label>
            <input id='postAge' type='number' min='0' name='age'/>
            <input className='makePostSubmit' type='submit' value='Make Post' />
        </form>
    );
};

const PostList = (props) => {
    const [posts, setPosts]= useState(props.posts);

    useEffect(() => {
        const loadPostsFromServer = async () => {
            const response = await fetch('/getPosts');
            const data = await response.json();
            setPosts(data.posts);
        };
        loadPostsFromServer();
    }, [props.reloadPosts]);
    if(posts.length === 0){
        return(
            <div className='postList'>
                <h3 className="emptyPost">No Posts Yet!</h3>
            </div>
        );
    }

    const postNodes = posts.map(post => {
        return (
            <div key={post.id} className='post'>
                <img src="/assets/img/postface.jpeg" alt="post face" className='postFace' />
                <h3 className='postName'>Name: {post.name}</h3>
                <h3 className='postAge'>Age: {post.age}</h3>
                <h3 className='postOwner'>This Post was made by: {post.owner?.displayName || 'Unknown'}</h3>
            </div>
        );
    });
    return (
        <div className='postList'>
            {postNodes}
        </div>
    );
};

const App = () => {
    const [reloadPosts, setReloadPosts] = useState(false);

    return(
        <div>
            <div id ="makePost">
                <PostForm triggerReload={() => setReloadPosts(!reloadPosts)} />
            </div>
            <div id='posts'>
                <PostList posts={[]} reloadPosts={reloadPosts} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App />);
};

window.onload = init;