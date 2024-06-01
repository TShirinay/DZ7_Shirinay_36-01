import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";

function PostsPage() {
    const { handleSubmit, register, setValue, reset } = useForm();

    const [posts, setPosts] = useState([]);
    const [postIdToUpdate, setPostIdToUpdate] = useState(null);

    useEffect(() => {
        getPosts();
    }, []);

    async function getPosts() {
        const response = await axios.get("http://localhost:8000/posts");
        setPosts(response.data);
    }

    async function updateData(id, values) {
        await axios.put(`http://localhost:8000/posts/${id}`, values);
        getPosts();
        setPostIdToUpdate(null);
        reset();
    }

    async function submit(values) {
        if (postIdToUpdate) {
            await updateData(postIdToUpdate, values);
        } else {
            await axios.post("http://localhost:8000/posts", values);
            getPosts();
        }
    }

    async function deletePost(id) {
        await axios.delete(`http://localhost:8000/posts/${id}`);
        getPosts();
    }

    async function getOnePost(id) {
        const response = await axios.get(`http://localhost:8000/posts/${id}`);
        const post = response.data;
        setValue("title", post.title);
        setValue("body", post.body);
        setPostIdToUpdate(id);
    }

    return (
        <div>
            <h2>Posts list</h2>

            <form onSubmit={handleSubmit(submit)}>
                <input type="text" {...register("title")} placeholder="title" />
                <textarea cols="30" rows="10" {...register("body")} placeholder="body"></textarea>
                <button type="submit">{postIdToUpdate ? "Update" : "Create"}</button>
            </form>

            <ul>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <li key={post.id}>
                            {post.title}
                            <button onClick={() => deletePost(post.id)}>Delete</button>
                            <button onClick={() => getOnePost(post.id)}>Get More Info</button>
                        </li>
                    ))
                ) : (
                    <p>список пуст</p>
                )}
            </ul>

            {postIdToUpdate && (
                <ul>
                    <li>Title: {posts.title}</li>
                    <li>Body: {posts.body}</li>
                </ul>
            )}
        </div>
    );
}

export default PostsPage;