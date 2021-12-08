const { timeFunction, getInput } = require('./common')

function partOne(input) {

}

function partTwo(input) {
  
}

async function start() {
  const numbers = getInput(`${__dirname}/day-0.txt`)

  const task1 = await timeFunction(() => partOne(numbers))
  const task2 = await timeFunction(() => partTwo(numbers))
  return [{ ans: task1.result.total, ms: task1.ms }, { ans: task2.result.total, ms: task2.ms }]
}

module.exports = start

start()