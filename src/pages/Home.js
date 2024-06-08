import React, { useContext, useState, useEffect } from 'react'
import { SessinContext } from '../SessionProvider';
import { Navigate } from 'react-router-dom';
import { SideMenu } from '../components/SideMenu';
import { postRepository } from '../repositories/posts';
import { authRepository } from '../repositories/auth';
import { Post } from '../components/Post';
import { Pagination } from '../components/Pagenation';

const limit = 5;

function Home() {
  const [content, setContents] = useState("");
  const [posts, setPosts] = useState([]);
  const { currentUser,setCurrentuser } = useContext(SessinContext);

  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async () => {
    try {
      const post = await postRepository.create(content, currentUser.id);
      setContents("");
      setPosts([{
        ...post,
        userId: currentUser.id,
        userName: currentUser.userName,
      }, ...posts])
      console.log(post);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchPosts = async (page) => {
    try {

      const posts = await postRepository.find(page, limit);
      setPosts(posts);
      console.log(posts);
    } catch (error) {
      console.error(error);
    }
  }

  const moveToNext = async () => {
    const nextPage = page + 1;
    await fetchPosts(nextPage);
    setPage(nextPage);
  };

  const moveToPrevious = async () => {
    const previousPage = page - 1;
    await fetchPosts(previousPage);
    setPage(previousPage);
  };

  const deletePost = async (postId) => {
    try {
      await postRepository.delete(postId);
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error(error);
    }
  }

  const signout = async () => {
    try {
      await authRepository.signout();
      setCurrentuser(null)
    } catch (error) {
      console.error(error);
    }
  }

  if (currentUser == null) {
    return <Navigate replace to="/signin" />
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#34D399] p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">SNS APP</h1>
          <button onClick={signout} className="text-white hover:text-red-600">ログアウト</button>
        </div>
      </header>
      <div className="container mx-auto mt-6 p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <textarea
                onChange={(e) => setContents(e.target.value)}
                value={content}
                className="w-full p-2 mb-4 border-2 border-gray-200 rounded-md"
                placeholder="What's on your mind?"
              />
              <button disabled={content === ""} onClick={createPost} className="bg-[#34D399] text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Post
              </button>
            </div>
            <div className="mt-4">
              {posts.map((post) => (
                <Post key={post.id} post={post} onDelete={deletePost} />
              ))}
            </div>
            <Pagination onPrev={page > 1 ? moveToPrevious : null}
              onNext={posts.length >= limit ? moveToNext : null} />
          </div>
          <SideMenu />
        </div>
      </div>
    </div>
  );
}

export default Home;