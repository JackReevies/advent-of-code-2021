const { timeFunction, getInput } = require('./common')

function partOne(coords, instructions) {
  const grid = []
  for (let i = 0; i < coords.length; i++) {
    const coord = coords[i];
    setCoord(grid, coord.x, coord.y, '#')
  }

  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];

    if (instruction.axis === 'y') {
      doHorizontalFold(grid, instruction.val)
    } else {
      doVerticalFold(grid, instruction.val)
    }

    return getDots(grid, '#').length // Part One says to only do one
  }
}

function partTwo(coords, instructions) {
  const grid = []
  for (let i = 0; i < coords.length; i++) {
    const coord = coords[i];
    setCoord(grid, coord.x, coord.y, '#')
  }

  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];

    if (instruction.axis === 'y') {
      doHorizontalFold(grid, instruction.val)
    } else {
      doVerticalFold(grid, instruction.val)
    }
  }

  completePicture(grid)
  return getDots(grid, '#').length
}

function completePicture(grid) {
  const dots = getDots(grid, '#')
  const xBiggest = dots.reduce((acc, obj) => obj.x > acc ? obj.x : acc, 0)
  const yBiggest = dots.reduce((acc, obj) => obj.y > acc ? obj.y : acc, 0)

  for (let y = 0; y <= yBiggest; y++) {
    for (let x = 0; x < xBiggest; x++) {
      const val = getCoord(grid, x, y)
      if (val !== '#') {
        setCoord(grid, x, y, '.')
      }
    }
  }

  for (let y = 0; y <= yBiggest; y++) {
    console.log(JSON.stringify(grid[y].filter(o => o)))
  }
}

function doVerticalFold(grid, x) {
  const coords = getDots(grid)
  for (let i = 0; i < coords.length; i++) {
    const coord = coords[i];

    if (coord.x < x) continue

    const xChange = coord.x - x

    setCoord(grid, coord.x, coord.y, undefined)

    if (x - xChange < 0) {
      continue
    }

    setCoord(grid, x - xChange, coord.y, '#')
  }
}

function doHorizontalFold(grid, y) {
  const coords = getDots(grid)
  for (let i = 0; i < coords.length; i++) {
    const coord = coords[i];

    if (coord.y < y) continue

    const yChange = coord.y - y

    setCoord(grid, coord.x, coord.y, undefined)

    if (y - yChange < 0) {
      continue
    }

    setCoord(grid, coord.x, y - yChange, '#')
  }
}

function getDots(grid, val = '#') {
  const coords = []
  for (let y = 0; y < grid.length; y++) {
    const line = grid[y];
    if (!line) continue
    for (let x = 0; x < line.length; x++) {
      const coord = line[x];
      if (coord === val) {
        coords.push({ x, y })
      }
    }
  }
  return coords
}

function getCoord(input, x, y) {
  if (input[y]) {
    if (input[y][x] || input[y][x] === 0) {
      return input[y][x]
    }
  }
}

function setCoord(input, x, y, val) {
  if (!input[y]) {
    input[y] = []
  }
  input[y][x] = val
}

function interpretInput(input) {
  const coords = []
  const instructions = []
  for (let i = 0; i < input.length; i++) {
    const line = input[i];
    const coordRegex = /(\d+),(\d+)/g.exec(line)
    if (coordRegex) {
      coords.push({ x: Number(coordRegex[1]), y: Number(coordRegex[2]) })
      continue
    }

    const instructionRegex = /fold along (x|y)=(\d+)/g.exec(line)
    if (instructionRegex) {
      instructions.push({ axis: instructionRegex[1], val: Number(instructionRegex[2]) })
    }
  }

  return { coords, instructions }
}

async function start() {
  const lines = getInput(`${__dirname}/day-13.txt`)
  const { coords, instructions } = interpretInput(lines)
  const task1 = await timeFunction(() => partOne(coords, instructions))
  const task2 = await timeFunction(() => partTwo(coords, instructions))
  console.log(JSON.stringify([{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]))
}

module.exports = start

start()