const { timeFunction, getInput } = require('./common')

function partOne(input) {
  const lengths = [7, 4, 3, 2]
  let count = 0
  return input.reduce((acc, obj) => {
    const goodDigits = obj.output.filter(x => lengths.indexOf(x.length) > -1)
    return acc + goodDigits.length
  }, 0)
}

function partTwo(input) {
  const unskewedNumbers = []
  for (let i = 0; i < input.length; i++) {
    const entry = input[i];
    const mappings = createMapping()
    const wireSegmentMapping = 'abcdefg'.split("").reduce((acc, obj) => { acc[obj] = null; return acc }, {})
    const patternDigit = []

    for (let x = 0; x < entry.patterns.length; x++) {
      const pattern = entry.patterns[x];
      if (pattern.length == 2) {
        patternDigit[1] = pattern
      } else if (pattern.length === 3) {
        patternDigit[7] = pattern
      } else if (pattern.length === 4) {
        patternDigit[4] = pattern
      } else if (pattern.length === 7) {
        patternDigit[8] = pattern
      }
    }

    for (let i = 0; i < patternDigit.length; i++) {
      const digit = patternDigit[i];
      if (digit === undefined) continue
      mappings[i].mappingOptions = digit.split("")
    }

    // Compare segments/letters in 1 to 7, the extra one in 7 is aaaa
    const aIs = patternDigit[7].split("").filter(o => patternDigit[1].indexOf(o) === -1)[0]
    wireSegmentMapping['a'] = aIs

    mappings.forEach(o => {
      if (o.segments.indexOf('a') === -1) {
        const index = o.mappingOptions.indexOf(aIs)
        if (index > -1) {
          o.mappingOptions.splice(index, 1)
        }
      }
    })

    // // Compare segments/letters in 1 and 2, the same one between the two is cc
    // // by the same logic, the one not present in 2 is ff
    // const cIs = pattern

    const sixPatterns = entry.patterns.filter(o => o.length === 6)
    const sixis = sixPatterns.find(o => o.indexOf(patternDigit[1][0]) === -1 || o.indexOf(patternDigit[1][1]) === -1)
    patternDigit[6] = sixis
    mappings[6].mappingOptions = sixis.split("")
    const cIs = mappings[8].mappingOptions.find(o => mappings[6].mappingOptions.indexOf(o) === -1)
    wireSegmentMapping['c'] = cIs

    mappings.forEach(o => {
      if (o.segments.indexOf('c') === -1) {
        const index = o.mappingOptions.indexOf(cIs)
        if (index > -1) {
          o.mappingOptions.splice(index, 1)
        }
      }
    })

    // We can find out what ff is by comparing 6 and 1. What 6 and 1 have in common is ff
    const fIs = patternDigit[1][0] === cIs ? patternDigit[1][1] : patternDigit[1][0]
    wireSegmentMapping['f'] = fIs

    mappings.forEach(o => {
      if (o.segments.indexOf('f') === -1) {
        const index = o.mappingOptions.indexOf(fIs)
        if (index > -1) {
          o.mappingOptions.splice(index, 1)
        }
      }
    })

    const zeroOrNine = sixPatterns.filter(o => o !== sixis)
    // We can find 9 by selecting the string with all characters from (4) in it
    patternDigit[9] = zeroOrNine[0].split("").filter(o => patternDigit[4].indexOf(o) === -1).length === 2 ? zeroOrNine[0] : zeroOrNine[1]
    patternDigit[0] = zeroOrNine[0] === patternDigit[9] ? zeroOrNine[1] : zeroOrNine[0]

    const dIs = patternDigit[8].split("").find(o => patternDigit[0].indexOf(o) === -1)
    wireSegmentMapping['d'] = dIs

    mappings.forEach(o => {
      if (o.segments.indexOf('d') === -1) {
        const index = o.mappingOptions.indexOf(dIs)
        if (index > -1) {
          o.mappingOptions.splice(index, 1)
        }
      }
    })

    const eIs = patternDigit[8].split("").find(o => patternDigit[9].indexOf(o) === -1)
    wireSegmentMapping['e'] = eIs

    mappings.forEach(o => {
      if (o.segments.indexOf('e') === -1) {
        const index = o.mappingOptions.indexOf(eIs)
        if (index > -1) {
          o.mappingOptions.splice(index, 1)
        }
      }
    })

    const fivePatterns = entry.patterns.filter(o => o.length === 5).map(o => o.split(""))
    // g is present in all 5s but b us only present in one
    const allChars = fivePatterns.reduce((acc, obj) => { acc = [...acc, ...obj]; return acc }, [])
    const lonelyChar = allChars.find(o => allChars.filter(x => x === o).length === 1 && Object.values(wireSegmentMapping).indexOf(o) === -1)

    const bIs = lonelyChar
    wireSegmentMapping['b'] = bIs

    mappings.forEach(o => {
      if (o.segments.indexOf('b') === -1) {
        const index = o.mappingOptions.indexOf(bIs)
        if (index > -1) {
          o.mappingOptions.splice(index, 1)
        }
      }
    })

    const gIs = patternDigit[8].split("").find(o => Object.values(wireSegmentMapping).indexOf(o) === -1)
    wireSegmentMapping['g'] = gIs

    mappings.forEach(o => {
      if (o.segments.indexOf('g') === -1) {
        const index = o.mappingOptions.indexOf(gIs)
        if (index > -1) {
          o.mappingOptions.splice(index, 1)
        }
      }
    })

    Object.values(mappings).forEach(o => {
      o.mappingOptions = o.mappingOptions.sort().join("")
    })

    const numbers = entry.output.map(code => {
      const wires = code.split("").sort().join("")
      return Object.values(mappings).find(o => o.mappingOptions === wires).digit
    })

    unskewedNumbers.push(Number(numbers.join("")))

    // console.log(Number(numbers.join("")))
  }

  return unskewedNumbers.reduce((acc, obj) => acc + obj , 0)
}

function createMapping() {
  const opts = 'abcdefg'.split("")
  return [
    { digit: 0, segments: 'abcefg'.split(""), mappingOptions: opts.slice() },
    { digit: 1, segments: 'cf'.split(""), mappingOptions: opts.slice() },
    { digit: 2, segments: 'acdeg'.split(""), mappingOptions: opts.slice() },
    { digit: 3, segments: 'acdfg'.split(""), mappingOptions: opts.slice() },
    { digit: 4, segments: 'bcdf'.split(""), mappingOptions: opts.slice() },
    { digit: 5, segments: 'abdfg'.split(""), mappingOptions: opts.slice() },
    { digit: 6, segments: 'abdefg'.split(""), mappingOptions: opts.slice() },
    { digit: 7, segments: 'acf'.split(""), mappingOptions: opts.slice() },
    { digit: 8, segments: 'abcdefg'.split(""), mappingOptions: opts.slice() },
    { digit: 9, segments: 'abcdfg'.split(""), mappingOptions: opts.slice() },
  ]
}

function getEntries(input) {
  return input.map(line => {
    const regex = /([a-z ]+) \| ([a-z ]+)/g.exec(line)
    return {
      patterns: regex[1].split(" "),
      output: regex[2].split(" ")
    }
  })
}

async function start() {
  const numbers = getInput(`${__dirname}/day-8.txt`)
  const entries = getEntries(numbers)
  const task1 = await timeFunction(() => partOne(entries))
  const task2 = await timeFunction(() => partTwo(entries))
  console.log([{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }])
}

module.exports = start

start()