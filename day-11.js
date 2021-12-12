const { timeFunction, getInput } = require('./common')

function partOne(input) {
  const days = 100
  let flashes = 0
  for (let i = 0; i < days; i++) {
    console.log(`on step ${i}`)
    flashes = performStep(input, flashes)
    console.log(`total flashes: ${flashes}`)
  }
}

function partTwo(input) {
  let step = 1
  while(true){
    console.log(`on step ${step}`)
    let flashes = performStep(input, 0)
    if (flashes === input.length * input[0].length) {
      break
    }
    step++
    console.log(`${flashes} on step ${step}`)
  }

  console.log(`all flashed on step ${step}`)
}

function performStep(input, flashes) {
  // Increase every puss by 1
  for (let y = 0; y < input.length; y++) {
    const line = input[y];
    for (let x = 0; x < line.length; x++) {
      const octo = line[x];
      input[y][x]++
    }
  }

  // Should any flash? (greater than 9)

  for (let y = 0; y < input.length; y++) {
    const line = input[y];
    for (let x = 0; x < line.length; x++) {
      const octo = line[x];

      if (octo > 9) {
        // Yes! this one should flash
        flashes += flashPuss(input, x, y, flashes)
      }
    }
  }

  return flashes
}

function flashPuss(input, x, y, flashes) {
  input[y][x] = 0
  let count = 1
  const adjacents = getAdjacent(input, x, y)
  for (let i = 0; i < adjacents.length; i++) {
    const adjacent = adjacents[i];
    if (input[adjacent.y][adjacent.x] === 0) {
      // Don't change - it's already flashed
      continue
    }
    input[adjacent.y][adjacent.x]++
    if (input[adjacent.y][adjacent.x] > 9) {
      // If this puts one over the edge, repeat this
      count += flashPuss(input, adjacent.x, adjacent.y, flashes)
    }
  }
  return count
}

function getAdjacent(input, x, y) {
  return [
    { depth: getCoord(input, x - 1, y), x: x - 1, y: y },
    { depth: getCoord(input, x + 1, y), x: x + 1, y: y },
    { depth: getCoord(input, x, y - 1), x: x, y: y - 1 },
    { depth: getCoord(input, x, y + 1), x: x, y: y + 1 },
    { depth: getCoord(input, x + 1, y + 1), x: x + 1, y: y + 1 },
    { depth: getCoord(input, x - 1, y - 1), x: x - 1, y: y - 1 },
    { depth: getCoord(input, x + 1, y - 1), x: x + 1, y: y - 1 },
    { depth: getCoord(input, x - 1, y + 1), x: x - 1, y: y + 1 },
  ]
    .filter(o => o || o === 0)
    .filter(o => o.x > -1 && o.y > -1 && o.x < 10 && o.y < 10)
}

function getCoord(input, x, y) {
  if (input[y]) {
    if (input[y][x] || input[y][x] === 0) {
      return input[y][x]
    }
  }
}

function interpretInput(input) {
  return input.map(o => o.split("").map(o => Number(o)))
}

async function start() {
  const numbers = getInput(`${__dirname}/day-11.txt`)
  const input = interpretInput(numbers)
  // const task1 = await timeFunction(() => partOne(input))
  const task2 = await timeFunction(() => partTwo(input))
  console.log([{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }])
}

module.exports = start

start()