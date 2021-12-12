const { timeFunction, getInput } = require('./common')

function partOne(input) {
  // input is an array of lines (so, ['00100', '11110', etc...])
  let builtGamma = "";
  let builtEpsilon = "";

  for (let x = 0; x < input[0].length; x++) {

    let ones = 0
    let zeros = 0

    for (let i = 0; i < input.length; i++) {
      // Can't just access a character in the string in JS
      // - have to split it into an array first
      const binaryStr = input[i].split("");

      const char = binaryStr[x];

      if (char === '1') {
        ones++
      } else {
        zeros++
      }
    }

    if (ones > zeros) {
      builtGamma += "1"
      builtEpsilon += "0"
    } else {
      builtGamma += "0"
      builtEpsilon += "1"
    }

  }

  // End up with say '10110' and '01001'
  return parseInt(builtGamma, 2) * parseInt(builtEpsilon, 2)
}

function partTwo(input) {

}

async function start() {
  const numbers = getInput(`${__dirname}/day-3.txt`)

  const task1 = await timeFunction(() => partOne(numbers))
  const task2 = await timeFunction(() => partTwo(numbers))
  console.log([{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }])
}

module.exports = start

start()