
import ListGroup from './ListGroup';
import usePosts from '../custom_hooks/usePosts';

function PostsList() {
  const {posts, isLoading, error} = usePosts();
  return (
    <>
      {isLoading ? (
        <p>Loading items...</p>
      ) : error ? (
        <p className="text-danger">Error loading items: {error}</p>
      ) : (
        <>
          <ListGroup  title='My Posts' items={posts.map(post=>post.title)}/>
        </>
      )}
    </>
  );
}

export default PostsList;
