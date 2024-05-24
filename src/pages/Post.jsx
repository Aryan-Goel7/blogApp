import React, { useState, useEffect, useMemo } from 'react';
import appwriteService from '../appwrite/config';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import ReactHtmlParser from "html-react-parser";
import { Container, Button } from '../components';

function Post() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPostContent] = useState(null);
    const [imagePath, setImagePath] = useState();
    const [loading, setLoading] = useState(true);
    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        const fetchPost = async () => {
            if (slug) {
                try {
                    const data = await appwriteService.getPost(slug);
                    if (data) {
                        const filePath = await appwriteService.getFilePreview(data.featuredImage);
                        if (filePath) {
                            setImagePath(filePath);
                        }
                        setPostContent(data);
                    } else {
                        navigate("/");
                    }
                } catch (err) {
                    console.error('Error fetching post:', err.message);
                    navigate("/");
                } finally {
                    setLoading(false);
                }
            } else {
                navigate("/");
            }
        };
        fetchPost();
    }, [slug, navigate]);

    const isAuthor = useMemo(() => post && userData ? post.userId === userData.$id : false, [post, userData]);

    const deletePost = async () => {
        try {
            const status = await appwriteService.deletePost(post.$id);
            if (status) {
                await appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        } catch (err) {
            console.error('Error deleting post:', err.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return post ? (
        <div className="py-8 bg-gray-50">
            <Container>
                <div className="w-full flex justify-center mb-4">
                    <div className="relative w-full max-w-3xl border rounded-xl overflow-hidden shadow-md h-64">
                        <img
                            src={imagePath}
                            alt={post.title}
                            className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black bg-opacity-50 px-4">
                            <h1 className="text-3xl font-bold text-white mb-2">{post.title}</h1>
                            <p className="text-gray-300 mb-4">by {post.author}</p>
                            {isAuthor && (
                                <div className="flex space-x-2">
                                    <Link to={`/edit-post/${post.$id}`}>
                                        <Button bgColor="bg-green-500" className="mr-3">
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button bgColor="bg-red-500" onClick={deletePost}>
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-full max-w-3xl prose mx-auto">{ReactHtmlParser(post.content)}</div>
            </Container>
        </div>
    ) : null;
}

export default Post;
