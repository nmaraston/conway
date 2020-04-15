import React from 'react';
import './Grid.css';

const CELL_ON_COLOR = 'rgba(0, 0, 0, 0.5)';
const CELL_OFF_COLOR = 'rgba(200, 200, 200, 0.5)';

class Grid extends React.Component {

  constructor(props) {
    super(props);

    this.canvasRef = React.createRef();

    this.state = {
      canvasWidth: 500,
      canvasHeight: 500,
      nrows: props.nrows,
      ncols: props.ncols,
      cells: Array(props.nrows).fill().map(()=>Array(props.ncols).fill(false)),
    };

    // TODO: Understand why binding is needed here?
    this.onCanvasClick = this.onCanvasClick.bind(this);
  }

  // TOOD: This will trigger a React re-render. 
  //  Support batch updates to minimize re-renders. 
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
        const cell = this.state.cells[row][col];
        if (cell) {
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
        <h1>Canvas</h1>
        <canvas id="canvas" 
          ref={this.canvasRef}
          width={this.state.canvasWidth} 
          height={this.state.canvasHeight} 
          onClick={this.onCanvasClick}/>
      </div>
    );
  }
}

export default Grid;
