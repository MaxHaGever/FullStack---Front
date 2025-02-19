import { useEffect, useState } from 'react';
import postService, { CanceledError } from '../Services/post_service';
import { Post } from '../Services/post_service';

const usePosts = () => {
      const [posts, setPosts] = useState<Post[]>([]);
      const [error, setError] = useState<string | null>(null);
      const [isLoading, setIsLoading] = useState(false);
    
      useEffect(() => {
        setIsLoading(true);
        const { request, abort } = postService.getAllPosts();
        request
          .then((response) => {
            console.log('Received posts:', response.data);
            setPosts(response.data);
            setIsLoading(false);
          })
          .catch((error) => {
            if (error instanceof CanceledError) {
              return;
            }
            console.error('Error fetching data:', error);
            setError(error.message);
            setIsLoading(false);
          });
    
        return () => {
          console.log('Cleanup: Aborting fetch');
          abort();
        };
      }, []);
      return {posts,setPosts, error, setError, isLoading, setIsLoading};
}

export default usePosts;