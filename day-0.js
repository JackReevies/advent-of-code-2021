const { timeFunction, getInput } = require('./common')

function partOne(input) {

}

function partTwo(input) {
  
}

async function start() {
  const numbers = getInput(`${__dirname}/day-0.txt`)

  const task1 = await timeFunction(() => partOne(numbers))
  const task2 = await timeFunction(() => partTwo(numbers))
  console.log(JSON.stringify([{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]))
}

module.exports = start

start()