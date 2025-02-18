function Post() {
    const title = "Book Title"
    const paragraph = "This is a paragraph"
    const getTitle = () => {
        return title
    }
    return (
      <div>
        <h1>{getTitle()}</h1>
        <p>{paragraph}</p>
      </div>
    )
  }

  export default Post