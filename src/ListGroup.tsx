import { useState,FC } from 'react';

interface ListGroupProps {
  title: string,
  items: string[]
}

const ListGroup: FC<ListGroupProps> = ({title,items}) =>{

  const [selectedIndex,setSelectedIndex] = useState(0);
  const [render,setRender] = useState(1);
  console.log("ListGroup");

  const onClick = (index: number) => {
    console.log("click" + index);
    setSelectedIndex(index);
  }

  const addItem = () => {
    items.push("A new item");
    console.log(items);
    setRender(render+1);
  }

  return (
    <div>
      <h1>{title}</h1>
        { items.length === 0 ? <p>No items</p> :
        <ul className="list-group">
            {items.map((item, index) => {
              return <li 
              className={selectedIndex === index ? "list-group-item active" : "list-group-item"}
              key={index} 
              onClick={()=>{onClick(index)}}>
              {index} {item}
                </li>}
              )}
        </ul>
        }
        <button onClick={addItem}>Add item</button>
   </div>
  );
}

export default ListGroup;