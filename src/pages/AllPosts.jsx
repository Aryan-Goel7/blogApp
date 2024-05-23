import React, { useState, useEffect } from 'react'
import appwriteService from '../appwrite/config'
import { Container, PostCard } from '../components'
import { useSelector } from 'react-redux'

function AllPosts() {
    const [allposts, setAllPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const userData = useSelector((state) => state.auth.userData)
    useEffect(() => {
        appwriteService.getUserPosts(userData.$id).then((posts) => {
            if (posts) {
                setAllPosts(posts.documents);
                setLoading(false);
            }
        })
    }, [])
    if (loading) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Loading....
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {allposts.map((posts) => (
                        <div key={posts.$id} className='p-2 w-1/4'>
                            <PostCard {...posts} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default AllPosts