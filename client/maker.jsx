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
        <form
            id="postForm"
            onSubmit={(e) => handlePost(e, props.triggerReload)}
            name="postForm"
            action="/maker"
            method="POST"
            className="postForm"
        >
            <h2>Write a Review of a song!</h2>

            <label htmlFor="songTitle">Song Title</label>
            <input id="songTitle" type="text" name="songTitle" placeholder="Enter the song title..."
            />

            <label htmlFor="genre">Genre</label>
            <select id="genre" name="genre" defaultValue="">
                <option value="" disabled>Choose a genre</option>
                {genreList.map((genreType) => (
                    <option key={genreType} value={genreType}>
                        {genreType}
                    </option>
                ))}
            </select>

            <label htmlFor="rating">Your Rating</label>
            <select id="rating" name="rating" defaultValue="">
                <option value="" disabled>Choose a rating</option>
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

            <label htmlFor="description">Your Review</label>
            <textarea id="description" name="description" placeholder="What did you like? What didn't you like?" rows="4"/>

            <input className="makePostSubmit" type="submit" value="Publish Review"/>
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
            <div className="postList">
                <h3 className="emptyPost">No Reviews Yet!</h3>
                <p>Be the first to share your opinion.</p>
            </div>
        );
    }

    const postNodes = posts.map(post => (
        <div key={post._id || post.id} className="post reviewCard">
            <h3 className="songTitle">{post.songTitle}</h3>

            <div className="reviewDetails">
                <span className="genre">{post.genre}</span>
                <span className="rating">★ {post.rating} / 5</span>
            </div>

            <p className="description">{post.description}</p>

            <p className="postOwner">
                Reviewed by: {post.owner?.displayName || 'Unknown'}
            </p>
        </div>
    ));

    return (
        <div className="postList">
            {postNodes}
        </div>
    );
};

const App = () => {
    const [reloadPosts, setReloadPosts] = useState(false);

    return (
        <div>
            <div id="makePost">
                <PostForm
                    triggerReload={() => setReloadPosts(!reloadPosts)}
                />
            </div>

            <div id="posts">
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