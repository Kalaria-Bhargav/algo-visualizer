import React, { useEffect, useState } from 'react'

const rows = 20;
const cols = 60;

const Main = ({ algoType }) => {

  const [clss, setClss] = useState([])
  const [mouseDown, setMouseDown] = useState(0);
  const [Grd, setGrd] = useState([]);
  const [st, setSt] = useState({ x: 5, y: 10 });
  const [endPt, setEndPt] = useState({ x: 13, y: 35 });
  const [isOnIn, setIsOnIn] = useState(false);
  const [isOnEnd, setIsOnEnd] = useState(false);
  const [isvisualizerOn, setIsvisualizerOn] = useState(false);


  const checkStr = (s, sub) => {
    return s.includes(sub);
  }

  let int = (a) => {
    return parseInt(a);
  }
  useEffect(() => {
    let currentRow = [];
    let gd = [];

    let cl = new Array(rows + 1);
    
    for (let i = 0; i < rows; i++) {
      currentRow = [];
      cl[i + 1] = new Array(cols + 1);
      
      for (let j = 0; j < cols; j++) {
        cl[i + 1][j + 1] = 'grid-item';
        currentRow.push(`${i + 1},${j + 1}`);
      }
      gd.push(currentRow);
    }
    cl[st.x][st.y] += ' stPos';
    cl[endPt.x][endPt.y] += ' etPos';
    setGrd(gd);

    setClss(cl);

  }, [])

  const isOnInHandler = () => { setIsOnIn(true) };
  const isOffInHandler = () => { setIsOnIn(false) };
  const isOnEndHandler = () => { setIsOnEnd(true) };
  const isOffEndHandler = () => { setIsOnEnd(false) };


  const mouseOverHandler = (e, clk) => {
    let a = e.target.id.split(',');
    let cl = clss;
    a[0] = int(a[0]);
    a[1] = int(a[1]);

    if (!(a[0] == st.x && a[1] == st.y) && !(a[0] == endPt.x && a[1] == endPt.y) && (mouseDown || clk) && !isOnIn && !isOnEnd) {
      e.target.className = "grid-item bckclr";
      cl[a[0]][a[1]] = "grid-item bckclr";
    }

    if (clk && isOnIn && (st.x != a[0] || st.y != a[1])) {
      cl[st.x][st.y] = 'grid-item';
      window.removeEventListener("mousedown", isOffInHandler);
      setSt({ x: a[0], y: a[1] });
      setIsOnIn(false);
      cl[a[0]][a[1]] = "grid-item stPos";
      document.getElementById(`${a[0]},${a[1]}`).addEventListener("mousedown", isOnInHandler);
    }

    if (clk && isOnEnd && (endPt.x != a[0] || endPt.y != a[1])) {
      cl[endPt.x][endPt.y] = 'grid-item';
      window.removeEventListener("mousedown", isOffEndHandler);
      setEndPt({ x: a[0], y: a[1] });
      cl[a[0]][a[1]] = "grid-item etPos";
      setIsOnEnd(false);
      document.getElementById(`${a[0]},${a[1]}`).addEventListener("mousedown", isOnEndHandler);
    }

    setClss(cl);
  }


  const clearGrid = async () => {
    let id = window.setTimeout(function () { }, 0);

    while (id--) {
      window.clearTimeout(id); // will do nothing if no timeout with id is present
    }

    if (isvisualizerOn) return;
    // console.log("clicked")
    let cl = clss;
    // console.log(cl)
    for (let i = 1; i <= rows; i++) {
      for (let j = 1; j <= cols; j++) {
        cl[i][j] = 'grid-item';
      }
    }

    cl[st.x][st.y] += ' stPos';
    cl[endPt.x][endPt.y] += ' etPos';
    setClss(cl);

  }
  const clearVisGrid =  () => {
    

    // if (isvisualizerOn) return;
    console.log("clicked On clearVisGrid")
    let cl = clss;
    console.log(cl)
    for (let i = 1; i <= rows; i++) {
      for (let j = 1; j <= cols; j++) {
        if(checkStr(cl[i][j], 'visPos') ||checkStr(cl[i][j], 'pathclr') )
        cl[i][j] = 'grid-item';
      }
    }

    cl[st.x][st.y] += ' stPos';
    cl[endPt.x][endPt.y] += ' etPos';
    setClss(cl);

  }
 

  const bfs_dfs = async (bfs) => {
    let vis = new Array(rows + 1);
    let parent = new Array(rows + 1);
    let dx = [-1, 0, 1, 0];
    let dy = [0, -1, 0, 1];
    let queue = [];

    for (let i = 0; i < rows + 1; i++) {

      vis[i] = new Array(cols + 1);
      parent[i] = new Array(cols + 1);
      for (let j = 0; j < cols + 1; j++) {
        vis[i][j] = false;
        parent[i][j] = { x: i, y: j };
      }
    }
    let got = false;
    let cl = clss;
    queue.push({ x: st.x, y: st.y });
    vis[st.x][st.y] = true;

    while (queue.length > 0) {
      let X = queue[0].x, Y = queue[0].y;
      if (bfs == 0) {
        X = queue[queue.length - 1].x; Y = queue[queue.length - 1].y;
      }

      if (bfs)
        queue.shift();
      else
        queue.pop();
      console.log(X, Y, queue.length);
      if(bfs)
      await new Promise(resolve => setTimeout(resolve, 0));
      else
      await new Promise(resolve => setTimeout(resolve, 10));
      if (!(X == st.x && Y == st.y)) {
        cl[X][Y] = 'grid-item visPos';
        document.getElementById(`${X},${Y}`).className = 'grid-item visPos';
      }

      for (let i = 0; i < 4; i++) {
        let newX = ((X) + dx[i]);
        let newY = ((Y) + dy[i]);

        if (newX === endPt.x && newY === endPt.y) {
          queue = []; 
          parent[newX][newY] = { x: X, y: Y };
          got = true;
          break;
        }
        if (newX >= 1 && newY >= 1 && newX <= rows && newY <= cols && vis[newX][newY] == false && !(newX == endPt.x && newY == endPt.y) && (checkStr(cl[newX][newY],"bckclr") == false)) {
          vis[newX][newY] = true;
          parent[newX][newY] = { x: X, y: Y };
          queue.push({ x: newX, y: newY });
        }
      }

    }
    if (got) {
      setClss(cl);
      pathfinding(parent);
    }else{
      alert("Path is Not Possible");
    }
    setIsvisualizerOn(false);
   
  }
  let pathfinding = async (parent) => {
    let path = [];

    let X = endPt.x, Y = endPt.y;
    let Tx, Ty;
    while (parent[X][Y].x !== X || parent[X][Y].y !== Y) {
      Tx = X; Ty = Y;
      X = parent[Tx][Ty].x;
      Y = parent[Tx][Ty].y;
      path.push({ x: X, y: Y });
    }
    path.pop();
    path.reverse();
    console.log(path);
    let cl = clss;
    for (let i = 0; i < path.length; i++) {
      cl[path[i].x][path[i].y] = 'grid-item pathclr';
      document.getElementById(`${path[i].x},${path[i].y}`).className = 'grid-item pathclr';
      await new Promise(resolve => setTimeout(resolve, 20));
    }
    setClss(cl);
  }

  const visualizeStart = () => {

    clearVisGrid();
    setIsvisualizerOn(true);
    if (algoType === 'bfs')
      bfs_dfs(1);
    if (algoType === 'dfs')
      bfs_dfs(0);
    console.log(algoType);
  }

  useEffect(() => {
    if (clss.length === 0) return;
    console.log(`join : ${st.x},${st.y}`)
    console.log(`join : ${endPt.x},${endPt.y}`)
    document.getElementById(`${endPt.x},${endPt.y}`).addEventListener("mousedown", isOnEndHandler);
    document.getElementById(`${st.x},${st.y}`).addEventListener("mousedown", isOnInHandler);

    return () => {
      console.log(`return part  ${st.x + 1},${st.y + 1}`);
    }
  }, [clss])

  window.addEventListener('mousedown', () => { setMouseDown(1) });
  window.addEventListener('mouseup', () => { setMouseDown(0) });

  return (
    <>
      <div className="gridContainer" >
        {Grd.map((row, rIdx) => {

          return (
            <React.Fragment key={rIdx} >
              {
                row.map((i, cIdx) => <div className={clss[rIdx + 1][cIdx + 1]} id={i} key={cIdx} onClick={e => mouseOverHandler(e, 1)} onMouseOver={e => mouseOverHandler(e, 0)} ></div>)
              }
            </React.Fragment>
          )
        })}
      </div>

      {isvisualizerOn && <button className="btn btn1" onMouseUp={() => { clearGrid(); setIsvisualizerOn(false); }}>Stop Visualizer</button>}
      {!isvisualizerOn && <button className="btn btn1" onMouseUp={() => { clearGrid(); }}>Clear Grid</button>}
      {/* <button className="btn btn1" onMouseUp={() => clearGrid() }>Clear Grid</button> */}
      {!isvisualizerOn && <button className="btn btn2" onMouseUp={() => {
        console.log("Start Visualize clicked");
        visualizeStart();
      }}>Start Visualize</button>}
      {isvisualizerOn && <button className="btn btn2" >Start Visualize</button>}
      
      {/* <div>End</div> */}
    </>
  )
}

export default Main
