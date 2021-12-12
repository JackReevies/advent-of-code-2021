const { timeFunction, getInput } = require('./common')

function partOne(input) {
  return getLowPoints(input).map(o => o.height + 1).reduce((acc, obj) => acc + obj, 0)
}

function getLowPoints(input) {
  const lowPoints = []
  for (let y = 0; y < input.length; y++) {
    const arr = input[y];
    for (let x = 0; x < arr.length; x++) {
      const point = arr[x]; // Or input[y][x]
      if (isLowerThanAll(point, getAdjacent(input, x, y))) {
        lowPoints.push({ height: point, x, y })
      }
    }
  }
  return lowPoints
}

function isLowerThanAll(num, arr) {
  return !arr.filter(o => o.depth <= num).length
}

function getAdjacent(input, x, y) {
  return [
    { depth: getCoord(input, x - 1, y), x: x - 1, y: y },
    { depth: getCoord(input, x + 1, y), x: x + 1, y: y },
    { depth: getCoord(input, x, y - 1), x: x, y: y - 1 },
    { depth: getCoord(input, x, y + 1), x: x, y: y + 1 }]
    .filter(o => o.depth || o.depth === 0)
}

function getCoord(input, x, y) {
  if (input[y]) {
    if (input[y][x] || input[y][x] === 0) {
      return input[y][x]
    }
  }
}

function partTwo(input) {
  const lowPoints = getLowPoints(input)
  for (let i = 0; i < lowPoints.length; i++) {
    const lowPoint = lowPoints[i];
    lowPoint.basin = getBasin(input, lowPoint.x, lowPoint.y)
  }

  lowPoints.sort((a,b) => a.basin.length > b.basin.length? -1 : 1)
  return lowPoints[0].basin.length * lowPoints[1].basin.length * lowPoints[2].basin.length
}

function getBasin(input, x, y) {
  const area = []
  thing(input, x, y, area)
  return area
}

function thing(input, x, y, arr, parentX, parentY, iter) {
  const adjecents = getAdjacent(input, x, y).filter(o => o.depth !== 9)
  // adjecents.forEach(o => {
  //   if (arr.find(x => x.x === o.x && x.y === o.y)) return
  //   arr.push(o)
  // })

  for (let i = 0; i < adjecents.length; i++) {
    const adjacent = adjecents[i];
    if (arr.find(x => x.x === adjacent.x && x.y === adjacent.y)) continue
    arr.push(adjacent)
    thing(input, adjacent.x, adjacent.y, arr, x, y, `${x},${y}`)
  }
}

function getBasinBounds(input, x, y) {
  let rightMost = { y, x: 0 }
  let leftMost = { y, x: input[0].length - 1 }
  let upMost = { y: 0, x }
  let downMost = { y: input.length - 1, x }
  for (let i = x; i < input[0].length; i++) {
    if (input[y][i] === 9) {
      // We've hit the end
      rightMost = { y, x: i - 1 }
    }
  }
  for (let i = x; i >= 0; i--) {
    if (input[y][i] === 9) {
      // We've hit the end
      leftMost = { y, x: i + 1 }
    }
  }

  for (let i = y; i < input.length; i++) {
    if (input[i][x] === 9) {
      // We've hit the end
      rightMost = { y: i - 1, x }
    }
  }
  for (let i = y; i >= 0; i--) {
    if (input[i][x] === 9) {
      // We've hit the end
      leftMost = { y: i + 1, x }
    }
  }
}

async function start() {
  const numbers = getInput(`${__dirname}/day-9.txt`)
  const input = numbers.map(o => o.split("").map(o => Number(o)))
  const task1 = await timeFunction(() => partOne(input))
  const task2 = await timeFunction(() => partTwo(input))
  console.log([{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }])
}

module.exports = start

start()