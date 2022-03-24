import "./App.css";
import { useCallback, useRef, useState } from "react";
import { produce } from "immer";
function App() {

  //We can change row and columns size from here
  const totalRows = 50;
  const totalCols = 50;

  //Total possibilities of position of having a neighbor
  const operations = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0],
  ];

  // Empty Canvas with no designs
  const generateEmptyCanvas = () => {
    const rows = [];
    for (let i = 0; i < totalRows; i++) {
      rows.push(Array.from(Array(totalCols), () => 0));
    }

    return rows;
  };

  const [canvas, setCanvas] = useState(() => {
    return generateEmptyCanvas();
  });

  const [playing, setPlaying] = useState(false);

  const playingRef = useRef(playing);
  playingRef.current = playing;

  // Play the Simulation or the Game
  const playSimulation = useCallback(() => {
    if (!playingRef.current) {
      return;
    }
    setCanvas((g) => {
      return produce(g, (focusPoint) => {
        for (let i = 0; i < totalRows; i++) {
          for (let j = 0; j < totalCols; j++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;

              // Checking condition that neighbors lies within canvas only
              if (
                newI >= 0 &&
                newI < totalRows &&
                newJ >= 0 &&
                newJ < totalCols
              ) {
                neighbors += g[newI][newJ];
              }
            });
            // Checking Game Rule that neighbors should not be less than 2 amd more than 3
            if (neighbors < 2 || neighbors > 3) {
              focusPoint[i][j] = 0;
            }
            // Rule: Any dead cell with exactly three live neighbors becomes a live cell
            else if (g[i][j] === 0 && neighbors === 3) {
              focusPoint[i][j] = 1;
            }
          }
        }
      });
    });
    setTimeout(playSimulation, 100);
  }, []);

  return (
    <>
      <div style={{ margin: "auto 5px" }}>
        <div className="header">
          <h1> Conway's Game of Life </h1>
          {/* Button to  play/pause game */}
          <button
            onClick={() => {
              setPlaying(!playing);
              if (!playing) {
                playingRef.current = true;
                playSimulation();
              }
            }}
          >
            {playing ? "Stop" : "Start"}{" "}
          </button>

          {/* Button to generate random game */}
          <button
            onClick={() => {
              const rows = [];
              for (let i = 0; i < totalRows; i++) {
                rows.push(
                  Array.from(Array(totalCols), () =>
                    Math.random() > 0.7 ? 1 : 0
                  )
                );
              }
              setCanvas(rows);
            }}
          >
            Random
          </button>

          {/* Button to clear the game */}
          <button
            onClick={() => {
              setCanvas(generateEmptyCanvas());
			  setPlaying(false);
            }}
          >
            Clear
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${totalCols}, 20px)`,
          }}
        >
          {/* Mapping the initial canvas */}
          {canvas.map((rows, i) =>
            rows.map((col, j) => (
              <div
                key={`${i}-${j}`}
                onClick={() => {
                  const activeBox = produce(canvas, (focusPoint) => {
                    focusPoint[i][j] = canvas[i][j] ? 0 : 1;
                  });
                  setCanvas(activeBox);
                }}
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: canvas[i][j] ? "grey" : undefined,
                  border: "solid 1px black",
                }}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default App;
