const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');


const genreList = [
    "Pop",
    "Rock",
    "Folk"
];
const handlePost = (e, onPostAdded) => {
    e.preventDefault();
    helper.hideError();

    const songTitle = e.target.querySelector('#songTitle').value;
    const genre = e.target.querySelector('#genre').value;
    const rating = e.target.querySelector('#rating').value;
    const description = e.target.querySelector('#description').value;

    if (!songTitle || !genre || !rating || !description) {
        helper.handleError('All Fields are required');
        return false;
    }

    helper.sendPost(e.target.action, { songTitle, genre, rating, description }, onPostAdded);
    return false;
}

const PostForm = (props) => {
    return (
        <form id="postForm"
            onSubmit={(e) => handlePost(e, props.triggerReload)}
            name="postForm"
            action="/maker"
            method='POST'
            className='postForm'
        >
            <label htmlFor='songTitle'>Song Title: </label>
            <input id='songTitle' type='text' name='songTitle' placeholder=' ' />
            <label htmlFor="genre">Genre: </label>
            <select id="genre" name="genre" defaultValue="">
                <option value="" disabled> </option>
                {genreList.map((genreType, index) => (
                    <option key={index} value={genreType}>
                        {genreType}
                    </option>))}
            </select>
            <label htmlFor="rating">Rating:</label>
            <select id="rating" name="rating" defaultValue="">
                <option value="0.0" disabled>0.0</option>
                <option value="0.5">0.5</option>
                <option value="1.0">1.0</option>
                <option value="1.5">1.5</option>
                <option value="2.0">2.0</option>
                <option value="2.5">2.5</option>
                <option value="3.0">3.0</option>
                <option value="3.5">3.5</option>
                <option value="4.0">4.0</option>
                <option value="4.5">4.5</option>
                <option value="5.0">5.0</option>
            </select>
            <label htmlFor='description'>Description: </label>
            <input id='description' type='text' name='description' placeholder="What did you like, what didn't you? " />
            <input className='makePostSubmit' type='submit' value='Post' />
        </form>
    );
};

const PostList = (props) => {
    const [posts, setPosts] = useState(props.posts);

    useEffect(() => {
        const loadPostsFromServer = async () => {
            const response = await fetch('/getPosts');
            const data = await response.json();
            setPosts(data.posts);
        };
        loadPostsFromServer();
    }, [props.reloadPosts]);
    if (posts.length === 0) {
        return (
            <div className='postList'>
                <h3 className="emptyPost">No Posts Yet!</h3>
            </div>
        );
    }

    const postNodes = posts.map(post => {
        return (
            <div key={post.id} className='post'>
                <img src="/assets/img/postface.jpeg" alt="post face" className='postFace' />
                <h3 className='songTitle'>Song Title: {post.songTitle}</h3>
                <h3 className='rating'>Rating: {post.rating}</h3>
                <h3 className='genre'>Genre: {post.genre}</h3>
                <p className='description'>{post.description}</p>
                <h3 className='postOwner'>This review was made by: {post.owner?.displayName || 'Unknown'}</h3>
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

    return (
        <div>
            <div id="makePost">
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
    root.render(<App />);
};

window.onload = init;