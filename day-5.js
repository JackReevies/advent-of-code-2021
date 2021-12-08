const { timeFunction, getInput } = require('./common')

function partOne(input) {
  const filteredInput = filterDiagonals(input)

  const grid = {} // where key is y co-ord and the arrays contained are x

  for (let i = 0; i < filteredInput.length; i++) {
    const line = filteredInput[i];
    const f = getForDirection(line);
    for (let o = f.start; o <= f.end; o++) {
      const y = f.constAxis === 'y' ? f.constant : o
      const x = f.constAxis === 'y' ? o : f.constant
      if (!grid[y]) {
        grid[y] = []
      }
      if (!grid[y][x]) {
        grid[y][x] = 0
      }
      grid[y][x]++
    }
  }


  return getAnswer(grid)
}

function getAnswer(grid) {
  let count = 0;
  Object.values(grid).forEach(level => {
    level.forEach(cell => {
      if (cell > 1) {
        count++;
      }
    })
  })
  return count;
}

function partTwo(input) {
  const filteredInput = filterDiagonals(input)
  const diagonals = input.filter(o => o.x1 !== o.x2 && o.y1 !== o.y2)

  const grid = {} // where key is y co-ord and the arrays contained are x

  for (let i = 0; i < filteredInput.length; i++) {
    const line = filteredInput[i];
    const f = getForDirection(line);
    for (let o = f.start; o <= f.end; o++) {
      const y = f.constAxis === 'y' ? f.constant : o
      const x = f.constAxis === 'y' ? o : f.constant
      if (!grid[y]) {
        grid[y] = []
      }
      if (!grid[y][x]) {
        grid[y][x] = 0
      }
      grid[y][x]++
    }
  }

  for (let i = 0; i < diagonals.length; i++) {
    const line = diagonals[i];
    const points = get45DegreePoints(line)
    
    points.forEach(point => {
      if (!grid[point.y]) {
        grid[point.y] = []
      }
      if (!grid[point.y][point.x]){
        grid[point.y][point.x] = 0
      }
      grid[point.y][point.x]++
    })
  }

  return getAnswer(grid)
}

function get45DegreePoints(line) {
  const points = []
  if (line.x1 < line.x2) {
    const xDiff = line.x2 - line.x1
    for (let i = 0; i <= xDiff; i++) {
      points.push({ x: line.x1 + i, y: line.y1 < line.y2? line.y1 + i : line.y1 - i })
    }
  } else {
    const xDiff = line.x1 - line.x2
    for (let i = 0; i <= xDiff; i++) {
      points.push({ x: line.x1 - i, y: line.y1 < line.y2? line.y1 + i : line.y1 - i })
    }
  }
  return points
}

function getForDirection(line) {
  if (line.x1 === line.x2) {
    return { constAxis: 'x', constant: line.x1, start: Math.min(line.y1, line.y2), end: Math.max(line.y1, line.y2) }
  } else {
    return { constAxis: 'y', constant: line.y1, start: Math.min(line.x1, line.x2), end: Math.max(line.x1, line.x2) }
  }
}

function interpretInput(input) {
  const lines = []
  for (let i = 0; i < input.length; i++) {
    const line = input[i];
    const reg = /(\d+),(\d+) -> (\d+),(\d+)/g.exec(line)
    if (!reg) {
      throw new Error(`Failed to interpret line`)
    }
    lines.push({ x1: Number(reg[1]), y1: Number(reg[2]), x2: Number(reg[3]), y2: Number(reg[4]) })
  }
  return lines
}

function filterDiagonals(lines) {
  return lines.filter(o => o.x1 === o.x2 || o.y1 === o.y2)
}

async function start() {
  const numbers = getInput(`${__dirname}/day-5.txt`)
  const input = interpretInput(numbers)

  const task1 = await timeFunction(() => partOne(input))
  const task2 = await timeFunction(() => partTwo(input))
  console.log([{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }])
}

module.exports = start

start()