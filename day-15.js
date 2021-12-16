const { timeFunction, getInput } = require('./common')

function partOne(input) {
  const currentPath = [{ x: 0, y: 0 }]
  const defaultPath = getDefaultRoute(input)
  const paths = [defaultPath]
  traverse2(input, currentPath, paths, defaultPath.risk, 0)
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

function traverse(grid, currentPath, paths, smallestRisk, currentRisk) {
  // {x,y}
  const step = currentPath[currentPath.length - 1]
  const options = getAdjacent(grid, step.x, step.y).filter(o =>
    !currentPath.find(x => x.x === o.x && x.y === o.y)
  )


  for (let i = 0; i < options.length; i++) {
    const option = options[i];

    if (currentRisk + option.risk > smallestRisk) {
      // No point continuing with this path as we know itll never be the lowest risk
      const aPath = [...currentPath, option]
      const str = aPath.map(o => `(${o.x}, ${o.y})`).join(", ")

      // Debug - max call stack
      const found = paths.find(o => o.string === str)
      if (found) {
        console.log(`oh no - we've been here before`)
      }

      paths.push({ steps: aPath, risk: currentRisk + option.risk, string: str })
      const last = currentPath.pop()
      currentRisk -= last.risk

      continue
    }

    if (option.x === grid[0].length - 1 && option.y === grid.length - 1) {
      // This is the end
      const aPath = [...currentPath, option]
      const str = aPath.map(o => `(${o.x}, ${o.y})`).join(", ")

      // Debug - max call stack
      const found = paths.find(o => o.string === str)
      if (found) {
        console.log(`oh no - we've been here before`)
      }


      paths.push({ steps: aPath, risk: currentRisk + option.risk, string: str })
      const last = currentPath.pop()
      currentRisk -= last.risk
      continue
    }

    currentPath.push(option)
    traverse(grid, currentPath, paths, smallestRisk, currentRisk + option.risk)
  }
}

function traverse2(grid, currentPath, paths, smallestRisk, currentRisk) {
  // {x,y}
  const step = currentPath[currentPath.length - 1]
  let options = getAdjacent(grid, step.x, step.y).filter(o =>
    !currentPath.find(x => x.x === o.x && x.y === o.y)
  )

  options.sort((a, b) => a.risk < b.risk ? -1 : 1)

  if (options.length && currentRisk + options[0].risk > smallestRisk) {
    // We know the next step here is going to take us over - no point in continue
    return
  }
  // options = options.filter(o => o.risk === options[0].risk)

  for (let i = 0; i < options.length; i++) {
    const option = options[i];

    if (currentRisk + option.risk > smallestRisk) {
      // No point continuing with this path as we know itll never be the lowest risk
      const aPath = [...currentPath, option]
      const str = aPath.map(o => `(${o.x}, ${o.y})`).join(", ")

      // Debug - max call stack
      const found = paths.find(o => o.string === str)
      if (found) {
        console.log(`oh no - we've been here before`)
      }

      paths.push({ steps: aPath, risk: currentRisk + option.risk, string: str })
      const last = currentPath.pop()
      currentRisk -= last.risk

      continue
    }

    if (option.x === grid[0].length - 1 && option.y === grid.length - 1) {
      // This is the end
      const aPath = [...currentPath, option]
      const str = aPath.map(o => `(${o.x}, ${o.y})`).join(", ")

      // Debug - max call stack
      const found = paths.find(o => o.string === str)
      if (found) {
        console.log(`oh no - we've been here before`)
      }

      if (currentRisk + option.risk < smallestRisk) {
        // Yay we found a route that beat our current best
        smallestRisk = currentRisk + option.risk
      }
      
      paths.push({ steps: aPath, risk: currentRisk + option.risk, string: str })
      const last = currentPath.pop()
      currentRisk -= last.risk
      continue
    }

    currentPath.push(option)
    traverse2(grid, currentPath, paths, smallestRisk, currentRisk + option.risk)
  }
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

function partTwo(input) {

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