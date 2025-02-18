import React, { useState, useEffect } from 'react'
import ListGroup from './ListGroup'
import axios from 'axios'

interface Post {
  _id: string,
  title: string,
  content: string,
  sender: string
}


function App() {
  const [index, setIndex] = useState(-1);
  const [items, setItems] = useState<string[]>([]);
  useEffect(() => {
    console.log("useEffect");
    axios.get<Post[]>('http://localhost:3004/posts').then((response) => {
      console.log(response.data);
      setItems(response.data.map((post) => post.title));
    })
  }, )
  return (
    <>
    <ListGroup title="My Items" items={items} onItemSelected = {(index) => {
      setIndex(index);
      console.log("Selected item: " + index);
    }}  />
    {index !== -1 && <p>Selected index: {index}</p>}
            {index == 0 &&
           <div className="alert alert-primary" role="alert">
           Alert!
            </div>
}
    </>   
  )
}

export default App
