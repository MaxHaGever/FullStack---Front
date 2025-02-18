import React, { useState } from 'react'
import ListGroup from './ListGroup'

function App() {
  const [index1, setIndex1] = useState(-1);
  const items =["An item", "A second item", "A third item", "A fourth item", "And a fifth one"];
  const items2 =["An item", "A sixth item", "A seventh item", "A eight item", "And a ninth one"];
  return (
    <>
    <ListGroup title="My Items" items={items} onItemSelected = {(index) => {
      setIndex1(index);
      console.log("Selected item: " + index);
    }}  />
    {index1 !== -1 && <p>Selected index: {index1}</p>}
    <ListGroup title="My 2nd Items" items={items2} onItemSelected = {(index) => {
      console.log("Selected item: " + index);
    }} 
    />
            {index1 == 0 &&
           <div className="alert alert-primary" role="alert">
           Alert!
            </div>
}
    </>
  )
}

/*function App2(){
  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center"
    }}>
    <div style={{
      backgroundColor: "red",
      width: "100px",
      height: "100%",
      flex: 1
    }}>
    </div>
    <div style={{
      backgroundColor: "blue",
      width: "100px",
      height: "50%",
      flex: 1
    }}>
    </div>
    <div style={{
      backgroundColor: "green",
      width: "100px",
      height: "25%",
      flex: 1
    }}>
    </div>
    </div>
  )
}
  */

export default App
