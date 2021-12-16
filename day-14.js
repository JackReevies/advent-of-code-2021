const { timeFunction, getInput } = require('./common')

function partOne(template, rules, steps) {
  let rolling = template.split("")
  for (let i = 0; i < steps; i++) {
    rolling = iterate(rolling, rules)
  }

  const counts = count(rolling)
  const hightest = Object.keys(counts).reduce((acc, key) => Math.max(counts[key], acc), 0);
  const smallest = Object.keys(counts).reduce((acc, key) => Math.min(counts[key], acc), Number.MAX_VALUE);
  return hightest - smallest
}

function iterate(template, rules) {
  let newTemplate = template.slice(0, 1)
  for (let x = 1; x < template.length; x++) {
    const char = template[x];
    const prevChar = template[x - 1];

    const rule = rules[`${prevChar}${char}`]

    if (!rule) {
      console.log(`Couldn't find a rule for ${prevChar}${char}`)
      continue
    }

    newTemplate.push(rule)
    newTemplate.push(char)
  }

  return newTemplate
}

function count(arr) {
  const counts = {}
  for (let i = 0; i < arr.length; i++) {
    const char = arr[i];
    if (!counts[char]) {
      counts[char] = 0
    }
    counts[char]++
  }
  return counts
}

function partTwo(template, rules, steps) {
  let pairs = {}
  template = template.split("")

  let index = 0
  for (let x = 1; x < template.length; x++) {
    const char = template[x];
    const prevChar = template[x - 1];

    if (!pairs[`${prevChar}${char}`]) {
      pairs[`${prevChar}${char}`] = 0
    }

    pairs[`${prevChar}${char}`]++
  }

  for (let i = 0; i < steps; i++) {
    pairs = iterateSmarter(pairs, rules)
  }



  const counts = countSmarter(pairs)
  const hightest = Object.keys(counts).reduce((acc, key) => Math.max(counts[key], acc), 0);
  const smallest = Object.keys(counts).reduce((acc, key) => Math.min(counts[key], acc), Number.MAX_VALUE);
  return Math.round(hightest / 2 - smallest / 2)
}

function iterateSmarter(pairs, rules) {
  const keys = Object.keys(pairs)
  const newPairs = {}

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const pair = key.split("")

    // New pair is formed from 1st char + rule char AND rule char + 2nd char
    const newPair1 = `${pair[0]}${rules[key]}`
    const newPair2 = `${rules[key]}${pair[1]}`
    if (newPairs[newPair1]) {
      newPairs[newPair1] += pairs[key]
    } else {
      newPairs[newPair1] = pairs[key]
    }

    if (newPairs[newPair2]) {
      newPairs[newPair2] += pairs[key]
    } else {
      newPairs[newPair2] = pairs[key]
    }
  }

  return newPairs
}

function countSmarter(pairs) {
  const counts = {}
  Object.keys(pairs).forEach(key => {
    const num = pairs[key]
    const split = key.split("")
    if (counts[split[0]]) {
      counts[split[0]] += num
    } else {
      counts[split[0]] = num
    }
    if (counts[split[1]]) {
      counts[split[1]] += num
    } else {
      counts[split[1]] = num
    }
  })
  return counts
}

function interpretInput(lines) {
  const template = lines[0]

  const rules = {}
  for (let i = 2; i < lines.length; i++) {
    const rule = lines[i]
    const regex = /([A-Z]{2}) \-> ([A-Z])/g.exec(rule)
    rules[regex[1]] = regex[2]
  }

  return { template, rules }
}

async function start() {
  const lines = getInput(`${__dirname}/day-14.txt`)
  const { template, rules } = interpretInput(lines)
  const task1 = await timeFunction(() => partOne(template, rules, 10))
  const task2 = await timeFunction(() => partTwo(template, rules, 1000000))
  console.log(JSON.stringify([{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]))
}

module.exports = start

start()