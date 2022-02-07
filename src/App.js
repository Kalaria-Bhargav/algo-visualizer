
import './App.css';
import Main from './components/Main';
import {useEffect, useState} from 'react';


function App() {
  const [algoType, setAlgoType] = useState("bfs");

  let handleAlgoTypes = (event) => {
      setAlgoType(event.target.value);
  }

  return (
    <div className="App">

   <div className='nodeTypes'> <div className='smp stPos' ></div>Starting Node <div className='smp etPos' ></div> Ending Node <div className='smp visPos' ></div> Visited Node <div className='smp bckclr' ></div>  wall path  </ div>  <div className='smp pathclr' ></div> Path Node
   <div className='algoTypes'>
          <select id="algorithm_type"  onChange={(e) => handleAlgoTypes(e)}>
          
            <option value="bfs">BFS(Breadth first search)</option>
            {/* <option value="dijkstra" >Dijkstra's Algorithm</option> */}
            {/* <option value="Astar">A* Search algorithm</option> */}
            <option value="dfs">DFS(Depth first search)</option>
          </select>
    </div>
      <Main algoType={algoType}/>
    </div>
  );
}

export default App;
