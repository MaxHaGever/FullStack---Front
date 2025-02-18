
import ListGroup from './ListGroup'

function App() {
  const items =["An item", "A second item", "A third item", "A fourth item", "And a fifth one"];
  const items2 =["An item", "A sixth item", "A seventh item", "A eight item", "And a ninth one"];
  return (
    <>
    <ListGroup title="My Items" items={items}/>
    <ListGroup title="My 2nd Items" items={items2}/>
    </>
  )
}

export default App
