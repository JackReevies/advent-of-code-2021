const { timeFunction, getInput } = require('./common')

function partOne(input) {
  const allFish = {}

  input.forEach(o => addFish(0, Number(o), 1, allFish))

  for (let i = 1; i <= 80; i++) {
    breedSingleDay(allFish, i)
    // console.log(`After day ${i} there are ${getTotalFish(allFish)} fish`)
  }

  return getTotalFish(allFish)
}

function breedSingleDay(allFish, day) {
  const keys = Object.keys(allFish)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const fish = allFish[key]

    fish.timeLeft--

    if (fish.timeLeft === -1) {
      fish.timeLeft = 6
      addFish(day, 8, fish.instances, allFish)
    }
  }
}

function partTwo(input) {
  const allFish = {}

  input.forEach(o => addFish(0, Number(o), 1, allFish))

  for (let i = 1; i <= 256; i++) {
    breedSingleDay(allFish, i)
    //console.log(`After day ${i} there are ${getTotalFish(allFish)} fish`)
  }
  return getTotalFish(allFish)
}

function getTotalFish(allFish) {
  return Object.values(allFish).reduce((acc, obj) => acc + obj.instances, 0)
}

function addFish(birthday, cooldown, instances, obj) {
  if (obj[`${birthday}-${cooldown}`]) {
    obj[`${birthday}-${cooldown}`].instances += instances
    return
  }
  obj[`${birthday}-${cooldown}`] = { birthday, cooldown, timeLeft: cooldown, instances: instances }
}

async function start() {
  const numbers = getInput(`${__dirname}/day-6.txt`)
  const input = numbers[0].split(',')
  const task1 = await timeFunction(() => partOne(input))
  const task2 = await timeFunction(() => partTwo(input))
  console.log(JSON.stringify([{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]))
}

module.exports = start

start()