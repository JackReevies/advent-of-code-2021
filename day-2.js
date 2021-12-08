const { timeFunction, getInput } = require('./common')

function partOne (instructions) {
  let depth = 0;
  let horizontal = 0;
  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];
    let regex = /(.+?) (\d+)/g.exec(instruction)
    let direction = regex[1]
    let units = Number(regex[2])

    if (direction === "forward") {
      horizontal += units
    } else if (direction === "down"){
      depth += units
    } else if (direction === "up"){
      depth -= units
    } else {
      throw new Error("Unknown direction")
    }
  }

  return horizontal * depth
}

async function start () {
  const numbers = getInput(`${__dirname}/day-2.txt`)

  const task1 = await timeFunction(() => partOne(numbers))
  const task2 = await timeFunction(() => partTwo(numbers))
  console.log([{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }])
}

function partTwo (instructions) {
  let depth = 0;
  let horizontal = 0;
  let aim = 0;
  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];
    let regex = /(.+?) (\d+)/g.exec(instruction)
    let direction = regex[1]
    let units = Number(regex[2])

    if (direction === "forward") {
      horizontal += units
      depth += (aim * units)
    } else if (direction === "down"){
      aim += units
    } else if (direction === "up"){
      aim -= units
    } else {
      throw new Error("Unknown direction")
    }
  }

  return horizontal * depth
}

module.exports = start

start()