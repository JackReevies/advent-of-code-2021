const { timeFunction, getInput } = require('./common')

function partOne(input) {
  const crabs = input.slice()

  const minCrab = Math.min(...crabs)
  const maxCrab = Math.max(...crabs)

  const positions = [] // {position: 0, fuel: 0}

  for (let i = minCrab; i <= maxCrab; i++) {
    positions.push({ position: i, fuel: getFuelCalculation(crabs, i) })
  }

  positions.sort((a, b) => a.fuel > b.fuel ? 1 : a.fuel === b.fuel ? a.position > b.position ? 1 : -1 : -1)
  console.log(`Best position is ${positions[0].position} for ${positions[0].fuel} fuel`)
  return positions[0].fuel
}

function getFuelCalculation(crabs, target) {
  let fuel = 0
  for (let i = 0; i < crabs.length; i++) {
    const crab = crabs[i];
    fuel += Math.abs(crab - target)
  }

  return fuel
}

function getFuelCalculationPart2(crabs, target) {
  let fuel = 0
  for (let i = 0; i < crabs.length; i++) {
    const crab = crabs[i];
    fuel += getFuelNeededForCrab(crab, target)
  }

  return fuel
}

function getFuelNeededForCrab(crab, target) {
  let fuel = 0
  let moves = Math.abs(crab - target)
  for (let i = 1; i <= moves; i++) {
    fuel += i
  }
  return fuel
}

function partTwo(input) {
  const crabs = input.slice()

  const minCrab = Math.min(...crabs)
  const maxCrab = Math.max(...crabs)

  const positions = [] // {position: 0, fuel: 0}

  for (let i = minCrab; i <= maxCrab; i++) {
    positions.push({ position: i, fuel: getFuelCalculationPart2(crabs, i) })
  }

  positions.sort((a, b) => a.fuel > b.fuel ? 1 : a.fuel === b.fuel ? a.position > b.position ? 1 : -1 : -1)
  console.log(`Best position is ${positions[0].position} for ${positions[0].fuel} fuel`)
  return positions[0].fuel
}



async function start() {
  const numbers = getInput(`${__dirname}/day-7.txt`)
  const input = numbers[0].split(',').map(o => Number(o))
  const task1 = await timeFunction(() => partOne(input))
  const task2 = await timeFunction(() => partTwo(input))
  console.log(JSON.stringify([{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]))
}

module.exports = start

start()