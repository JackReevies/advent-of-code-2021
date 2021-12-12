const { timeFunction, getInput } = require('./common')

function partOne(input) {
  let sum = 0
  for (let i = 0; i < input.length; i++) {
    const line = input[i];
    sum += getCorruptedLineScore(line)
  }
  return sum
}

function getCorruptedLineScore(line) {
  let order = []

  line = line.split("")
  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '(') {
      order.push(')')
    } else if (char === '[') {
      order.push(']')
    } else if (char === '{') {
      order.push('}')
    } else if (char === '<') {
      order.push('>')
    }
    else if (char === order.pop()) {
      // Closing character is as expected
    } else {
      // Bad! this must be corrupted?!
      return [
        { char: ')', score: 3 },
        { char: ']', score: 57 },
        { char: '}', score: 1197 },
        { char: '>', score: 25137 },
      ].find(o => o.char === char).score
    }
  }

  return 0
}

function partTwo(input) {
  const incompleteLines = input.map(o => fixIncomplete(o)).filter(o => o)
  incompleteLines.sort((a, b) => a > b ? -1 : 1)
  return incompleteLines[Math.round(incompleteLines.length / 2) - 1]
}

function getOpposite(char) {
  if (char === '(') {
    return ')'
  } else if (char === ')') {
    return '('
  } else if (char === '[') {
    return ']'
  } else if (char === ']') {
    return '['
  } else if (char === '{') {
    return '}'
  } else if (char === '}') {
    return '{'
  } else if (char === '<') {
    return '>'
  } else if (char === '>') {
    return '<'
  }
}

function fixIncomplete(line) {
  let order = []

  line = line.split("")


  const closing = [')', '}', ']', '>']
  const opening = ['(', '{', '[', '<']

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (opening.find(o => o === char)) {
      order.push(char)
    } else if (closing.find(o => o === char)) {
      let target = getOpposite(char)
      if (order.pop() !== target) {
        // Must be corrupt - don't bother
        return null
      }
      line.splice(i, 1)
      let targetIndex = -1
      for (let a = i - 1; a >= 0; a--) {
        if (line[a] === target) {
          targetIndex = a
          break
        }
      }
      if (targetIndex === -1) {
        console.log('help')
      }
      line.splice(targetIndex, 1)
      i -= 2
    }
  }

  if (!line.length) {
    // Line is complete and does not need fixing
    return null
  }

  const fixOrder = order.reverse()
  let scores = [
    { char: ')', score: 1 },
    { char: ']', score: 2 },
    { char: '}', score: 3 },
    { char: '>', score: 4 },
  ]
  let score = 0
  for (let i = 0; i < fixOrder.length; i++) {
    const char = getOpposite(fixOrder[i]);
    score *= 5
    score += scores.find(o => o.char === char).score
  }
  return score
}

async function start() {
  const numbers = getInput(`${__dirname}/day-10.txt`)

  const task1 = await timeFunction(() => partOne(numbers))
  const task2 = await timeFunction(() => partTwo(numbers))
  console.log([{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }])
}

module.exports = start

start()