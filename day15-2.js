const { timeFunction, getInput } = require('./common')

function partOne(input) {
  const startPath = [{ risk: getCoord(input, 0, 0), x: 0, y: 0 }]
  const defaultPath = getDefaultRoute(input)
  const paths = []
  const leastRisk = { risk: defaultPath.risk }
  traverse(input, startPath, paths, leastRisk)
  return leastRisk.risk - getCoord(input, 0, 0)
}

function partTwo(input) {

}

function getDefaultRoute(grid) {
  const currentPath = []
  let risk = 0
  for (let x = 0; x < grid[0].length; x++) {
    currentPath.push({ x, y: 0 })
    risk += getCoord(grid, x, 0)
  }

  for (let y = 0; y < grid.length; y++) {
    currentPath.push({ x: grid[0].length - 1, y })
    risk += getCoord(grid, grid[0].length - 1, y)
  }

  return { steps: currentPath, risk }
}

function filterVisitedNodes(adjacents, path) {
  const opts = []
  for (let i = 0; i < adjacents.length; i++) {
    const adjacent = adjacents[i];

    if (path.find(o => o.x === adjacent.x && o.y === adjacent.y)) {
      continue
    }
    opts.push(adjacent)
  }
  return opts
}

function traverse(grid, currentPath, paths, leastRisk) {
  const step = currentPath[currentPath.length - 1]
  // Get all adjacents
  const adjacents = getAdjacent(grid, step.x, step.y)
  // Exclude ones we've already visited
  const opts = filterVisitedNodes(adjacents, currentPath) // adjacents.filter(o => !currentPath.find(a => a.x === o.x && a.y === o.y))

  // Optimisation 1: Sort each option by lowest value
  opts.sort((a, b) => a.risk < b.risk ? -1 : 1)

  if (!opts.length) {
    // We're blocked in - nowhere to go - path is invalid
    currentPath.pop()
    return
  }

  for (let i = 0; i < opts.length; i++) {
    const option = opts[i];

    currentPath.push(option)

    const risk = getRisk(currentPath)

    // Optimization 2: if adding this option goes over our leastRisk route - don't
    if (risk > leastRisk.risk) {
      currentPath.pop()
      continue
    }

    if (option.x === grid[0].length - 1 && option.y === grid.length - 1) {
      // This is the finish cell - we have a complete route
      const str = currentPath.map(o => `(${o.x}, ${o.y})`).join(", ")
      const risk = getRisk(currentPath)

      if (risk < leastRisk.risk) {
        console.log(`Found new lowest risk of ${risk}`)
        leastRisk.risk = risk
        leastRisk.str = str
      }

      if (paths.find(o => o.str === str)) {
        console.log(`ohno`)
      }
      paths.push({ path: currentPath.slice(), risk, str })

      currentPath.pop()
      // But we want to continue to find ALL valid paths
      continue
    }

    traverse(grid, currentPath, paths, leastRisk)
  }

  // Getting here means that we've exhaused all opts and we should back off
  currentPath.pop()
}

function getRisk(path) {
  return path.reduce((acc, obj) => acc + obj.risk, 0)
}

function getAdjacent(input, x, y) {
  return [
    { risk: getCoord(input, x - 1, y), x: x - 1, y: y },
    { risk: getCoord(input, x + 1, y), x: x + 1, y: y },
    { risk: getCoord(input, x, y - 1), x: x, y: y - 1 },
    { risk: getCoord(input, x, y + 1), x: x, y: y + 1 },
    // { risk: getCoord(input, x + 1, y + 1), x: x + 1, y: y + 1 },
    // { risk: getCoord(input, x - 1, y - 1), x: x - 1, y: y - 1 },
    // { risk: getCoord(input, x + 1, y - 1), x: x + 1, y: y - 1 },
    // { risk: getCoord(input, x - 1, y + 1), x: x - 1, y: y + 1 },
  ]
    .filter(o => o.risk > 0)
}

function getCoord(input, x, y) {
  if (input[y]) {
    if (input[y][x] || input[y][x] === 0) {
      return input[y][x]
    }
  }
}

async function start() {
  const lines = getInput(`${__dirname}/day-15.txt`)
  const grid = lines.map(o => o.split("").map(o => Number(o)))
  const task1 = await timeFunction(() => partOne(grid))
  const task2 = await timeFunction(() => partTwo(grid))
  console.log(JSON.stringify([{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]))
}
module.exports = start

start()