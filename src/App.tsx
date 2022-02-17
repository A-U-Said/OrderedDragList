import OrderedDragList from "./components/OrderedDragList";
import dummyData from "./components/dummyData";

function App(): JSX.Element {

  const exportTree = (treeState: string): void => {
    console.log(treeState);
  }

  return (
    <div className="App">
      <OrderedDragList childLists={dummyData} callback={exportTree}/>
    </div>
  );
}

export default App;
