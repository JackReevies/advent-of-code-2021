const { timeFunction, getInput } = require('./common')

function partOne(input) {
  const start = input.filter(o => o.find(o => o === "start"))
  const end = input.filter(o => o.find(o => o === "end"))

  const paths = []

  for (let i = 0; i < start.length; i++) {
    const startPath = start[i];
    const goesTo = startPath.find(o => o !== "start")

    const currentPath = { steps: ["start", goesTo] }
    traversePath(input, paths, currentPath, goesTo)
  }
  const ans = paths.map(o => o.join(","))
  ans.sort()
  return ans.length
}

function traversePath(input, paths, path, step) {
  const others = input.filter(o => o.find(o => o === step))

  for (let i = 0; i < others.length; i++) {
    const other = others[i];
    const option = other.find(o => o !== step)

    if (isLowercase(option) && path.steps.find(o => o === option)) {
      // Can't do this because we just visited it and its a small cave
      continue
    }

    path.steps.push(option)
    if (option === "end") {
      paths.push(path.steps.slice())
      path.steps.pop()
      continue
    }
    traversePath(input, paths, path, option)
  }
  path.steps.pop()
}

function traversePathTwo(input, paths, path, step) {
  const others = input.filter(o => o.find(o => o === step))

  for (let i = 0; i < others.length; i++) {
    const other = others[i];
    const option = other.find(o => o !== step)

    if (option === "start") {
      // We can't go back to the start cave
      continue
    }

    if (isLowercase(option)){
      const prevEncounters = path.steps.filter(o => o === option).length

      if (prevEncounters > 1 || (prevEncounters > 0 && containsSameSmallCaveTwice(path.steps))) {
        // Can't do this because we've previously hit this small cave'
        continue
      }
    }

    path.steps.push(option)

    if (isLowercase(option)) {
      path.smallVisited = option
    }

    if (option === "end") {
      paths.push(path.steps.slice())
      path.steps.pop()
      continue
    }
    traversePathTwo(input, paths, path, option)
  }

  const last = path.steps.pop()
  if (last === path.smallVisited) {
    // We've now gone back and NOT visited this - so remove it
    path.smallVisited = path.steps.find(o => isLowercase(o) && o !== "start" && o !== "end")
  }
}

function isLowercase(str) {
  return str === str.toLowerCase()
}

function containsSameSmallCaveTwice(path, exclude) {
  const lowercases = path.filter(o => isLowercase(o) && o !== "start" && o !== "end" && o !== exclude)
  for (let i = 0; i < lowercases.length; i++) {
    const cave = lowercases[i];
    if (lowercases.filter(o => o === cave).length > 1) {
      return true
    }
  }
}

function partTwo(input) {
  const start = input.filter(o => o.find(o => o === "start"))
  const end = input.filter(o => o.find(o => o === "end"))

  const paths = []

  for (let i = 0; i < start.length; i++) {
    const startPath = start[i];
    const goesTo = startPath.find(o => o !== "start")

    const currentPath = { steps: ["start", goesTo] }
    traversePathTwo(input, paths, currentPath, goesTo)
  }
  const ans = paths.map(o => o.join(","))
  ans.sort()
  return ans.length
}

async function start() {
  const numbers = getInput(`${__dirname}/day-12.txt`)
  const input = numbers.map(o => o.split("-"))
  const task1 = await timeFunction(() => partOne(input))
  const task2 = await timeFunction(() => partTwo(input))
  console.log(JSON.stringify([{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]))
}

module.exports = start

start()