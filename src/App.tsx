import OrderedDragList from "./components/OrderedDragList";
import dummyData from "./components/dummyData";

function App(): JSX.Element {
  return (
    <div className="App">
      <OrderedDragList childLists={dummyData}/>
    </div>
  );
}

export default App;
