import React from 'react';
import './Grid.css';
import {ReactComponent as PlayBtnIcon} from './play_btn.svg';

const CELL_ON_COLOR = 'rgba(0, 0, 0, 0.5)';
const CELL_OFF_COLOR = 'rgba(200, 200, 200, 0.5)';

class Grid extends React.Component {

  constructor(props) {
    super(props);

    this.canvasRef = React.createRef();

    this.state = {
      // TODO: Should these be in this.state since they never change?
      canvasWidth: 1000,
      canvasHeight: 1000,
      nrows: props.nrows,
      ncols: props.ncols,

      cells: Array(props.nrows).fill().map(()=>Array(props.ncols).fill(false)),
    };

    // TODO: Understand why binding is needed here?
    this.onCanvasClick = this.onCanvasClick.bind(this);
    this.stepGeneration = this.stepGeneration.bind(this);
  }

  isValidCoordinate(row, col) {
    return (row >= 0 && row < this.state.nrows && col >= 0 && col < this.state.ncols);
  }

  countLiveNeighbours(cells, row, col) {
    var count = 0;
    const steps = [-1, 0, 1];
    for (var i = 0; i < steps.length; i++) {
      for (var j = 0; j < steps.length; j++) {
        const nRow = row + steps[i];
        const nCol = col + steps[j];


        if (nRow === row && nCol === col) {
          continue;
        }

        if (this.isValidCoordinate(nRow, nCol) && cells[nRow][nCol]) {
          if (row === 1 && col === 2) {
            console.log(`(${nRow}, ${nCol})`);
          }
          count++;
        }
      }
    }
    if (row === 1 && col === 2) {
      console.log(`${count}`);
    }
    return count;
  }

  stepGeneration() {
    const cells = this.state.cells;
    const updatedCells = cells.map(row => row.slice());

    for (var row = 0; row < cells.length; row++) {
      for (var col = 0; col < cells[row].length; col++) {
        const isAlive = cells[row][col];
        const liveNeighbours = this.countLiveNeighbours(cells, row, col);


        let nextGenState = false;
        if (isAlive) {
          if (liveNeighbours === 2 || liveNeighbours === 3) {
            nextGenState = true;
          }
        } else if (liveNeighbours === 3) {
          nextGenState = true;
        }
        updatedCells[row][col] = nextGenState;
      }
    }

    this.setState({
      cells: updatedCells,
    });
  }

  toggleCell(row, col) {
    const updatedCells = [...this.state.cells];
    updatedCells[row][col] = !updatedCells[row][col];
    this.setState({
      cells: updatedCells,
    });
  }

  onCanvasClick(e) {
    const canvas = this.canvasRef.current;

    // Compute click coordinates relative to canvas
    const rect = canvas.getBoundingClientRect();
    const xClick = e.clientX - rect.left;
    const yClick = e.clientY - rect.top;

    // Compute cell coordinates
    const col = Math.floor((xClick / this.state.canvasWidth) * this.state.ncols);
    const row = Math.floor((yClick / this.state.canvasHeight) * this.state.nrows);

    this.toggleCell(row, col);
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  draw() {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);

    const cellWidth = this.state.canvasWidth / this.state.ncols;
    const cellHeight = this.state.canvasHeight / this.state.nrows;

    for (var row = 0; row < this.state.cells.length; row++) {
      for (var col = 0; col < this.state.cells[row].length; col++) {
        const isAlive = this.state.cells[row][col];
        if (isAlive) {
          ctx.fillStyle = CELL_ON_COLOR;
        } else {
          ctx.fillStyle = CELL_OFF_COLOR;
        }
        ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
      }
    }
  }

  render() {
    return (
      <div className="grid">
        <canvas id="canvas" 
          ref={this.canvasRef}
          width={this.state.canvasWidth} 
          height={this.state.canvasHeight} 
          onClick={this.onCanvasClick}/>
        <br/>
        <PlayBtnIcon className="playBut" onClick={this.stepGeneration}/>
      </div>
    );
  }
}

export default Grid;
