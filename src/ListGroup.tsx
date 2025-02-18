import { useState,FC } from 'react';
import ListGroupStyle from "./ListGroup.module.css"
interface ListGroupProps {
  title: string,
  items: string[]
  onItemSelected: (index: number) => void
}

const ListGroup: FC<ListGroupProps> = ({title,items, onItemSelected}) =>{

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

  const onSelect = () => {
    onItemSelected(selectedIndex);
  }
  return (
    <div className={ListGroupStyle.container}>
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
        <button className='btn btn-primary m-3' onClick={addItem}>Add item</button>
        <button className='btn btn-danger' onClick={onSelect}>Select</button>
   </div>
   
  );
}

export default ListGroup;