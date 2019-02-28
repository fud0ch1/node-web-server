// Code copied from https://codepen.io/atwulf/pen/oLBmWO 
console.clear()

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

let colors = {
  alive: 'blue',
  dead: '#efefef',
}

let conwaySize = 150
let canvasSize = 800

canvas.width = canvasSize
canvas.height = canvasSize

/**
 * Conways' Game of Life
 *
 * Every cell interacts with its eight neighbours, which are the
 * cells that are horizontally, vertically, or diagonally adjacent.
 *
 * At each step in time, the following transitions occur:
 *
 * 1. Any live cell with fewer than two live neighbours dies, as if caused by under-population.
 * 2. Any live cell with two or three live neighbours lives on to the next generation.
 * 3. Any live cell with more than three live neighbours dies, as if by over-population.
 * 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
 *
 * The initial pattern constitutes the seed of the system. The first
 * generation is created by applying the above rules simultaneously to
 * every cell in the seed—births and deaths occur simultaneously, and
 * the discrete moment at which this happens is sometimes called a tick
 * (in other words, each generation is a pure function of the preceding one).
 */

function Cell() {
  this.alive = Math.random() > .6
  this.livingNeighbors = 0
}

function Conway(size) {
  this.size = size
  this.cellSize = canvas.width / size
  this.grid = generateGrid(size)
  this.directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
  ]
}

function generateGrid(size) {
  let grid = []
  for (var row = 0; row < size; row++) {
    grid[row] = []
    for (var col = 0; col < size; col++) {
      grid[row][col] = new Cell()
    }
  }

  return grid
}

Conway.prototype.forEachCell = function(fn) {
  for (var row = 0; row < this.size; row++) {
    for (var col = 0; col < this.size; col++) {
      fn.length === 1 ? fn(this.grid[row][col]) : fn(row, col)
    }
  }
}

Conway.prototype.draw = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  this.forEachCell((r, c) => {
    let cell = this.grid[r][c]
    ctx.fillStyle = cell.alive ? 'hsla(' + (r + c < 100 ? r + c * 10 : r + c * 5) + ', 80%, 80%, 1)' : 'hsla(240, 30%, 20%, ' + (cell.livingNeighbors === 3 ? .7 : .5) + ')'
    ctx.fillRect(r * this.cellSize, c * this.cellSize, r + this.cellSize, c + this.cellSize)
  })
}

Conway.prototype.isUnderpopulated = function(r, c) {
  let cell = this.grid[r][c]
  return cell.livingNeighbors < 2
}

Conway.prototype.isOverpopulated = function(r, c) {
  let cell = this.grid[r][c]
  return cell.livingNeighbors > 3
}

Conway.prototype.isResurrectable = function(r, c) {
  let cell = this.grid[r][c]
  return !cell.alive && cell.livingNeighbors === 3
}

Conway.prototype.isInBounds = function(r, c) {
  return r >= 0 && r < this.size && c >= 0 && c < this.size
}

Conway.prototype.updateNeighborsForCell = function(r, c) {
  let cell = this.grid[r][c]
  cell.livingNeighbors = 0

  for (var x = 0; x < this.directions.length; x++) {
    let direction = this.directions[x]
    let row = direction[0] + r
    let col = direction[1] + c
    if (this.isInBounds(row, col)) {
      let neighbor = this.grid[row][col]
      if (neighbor.alive) {
        cell.livingNeighbors++
      }
    }
  }
}

Conway.prototype.updateNeighbors = function() {
  this.forEachCell(this.updateNeighborsForCell.bind(this))
}

Conway.prototype.updateStateForCell = function(r, c) {
  let cell = this.grid[r][c]
  if (this.isUnderpopulated(r, c) || this.isOverpopulated(r, c)) {
    cell.alive = false
  } else if (this.isResurrectable(r, c)) {
    cell.alive = true
  }
}

Conway.prototype.updateStates = function() {
  this.forEachCell(this.updateStateForCell.bind(this))
}

let conway = new Conway(conwaySize)

setInterval(function() {
  conway.updateNeighbors()
  conway.updateStates()
}, 50)

requestAnimationFrame(function DRAW() {
  conway.draw()

  requestAnimationFrame(DRAW)
})
