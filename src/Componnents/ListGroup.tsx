import { useState,FC } from 'react';
import ListGroupStyle from "./ListGroup.module.css"
interface ListGroupProps {
  title: string,
  items: string[]
}

const ListGroup: FC<ListGroupProps> = ({title,items}) =>{

  const [selectedIndex,setSelectedIndex] = useState(0);
  const [render,setRender] = useState(1);

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
    <div className={ListGroupStyle.container}>
      <h1>{title}</h1>
        { items.length === 0 ? <p>No items</p> :
        <ul className="list-group mt-3">
            {items.map((item, index) => {
              return <li 
              className={selectedIndex === index ? "list-group-item active" : "list-group-item"}
              key={index} 
              onClick={()=>{onClick(index)}}>
              {item}
                </li>}
              )}
        </ul>
        }
        <button className='btn btn-primary mt-3' onClick={addItem}>Add item</button>
   </div>
   
  );
}

export default ListGroup;