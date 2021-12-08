const { timeFunction, getInput } = require('./common')

const days = 80

function partOne(input) {

  const initialFish = input.map(o => { return { birthday: 0, cooldown: Number(o) } })

  let total = initialFish.length;

  let processing = initialFish.slice()

  while (processing.length) {
    const fish = processing[0]
    const spawned = breed(fish, days)

    spawned.forEach(o => {
      processing.push(o);
      total++;
    })

    processing.splice(0, 1)
  }

  return total
}

function breed(fish, lived) {
  let offspring = []
  let day = fish.birthday

  day += fish.cooldown + 1
  if (day > lived) {
    return []
  }
  offspring.push({ birthday: day, cooldown: 8, parent: fish.birthday})

  while (day < (lived - 6)) {
    day += 7
    offspring.push({ birthday: day, cooldown: 8, parent: fish.birthday })
  }

  return offspring
}

function partTwoOld(input) {
  const days = 256

  const initialFish = input.map(o => { return { birthday: 0, cooldown: Number(o) } })

  let total = initialFish.length;

  let processing = initialFish.slice()

  // Day[cooldown] = [] <- fish array
  let cache = {}

  let last = Date.now()

  const answer = 26984457539
  setInterval(() => {
    console.log(`Current fish: ${total} / ${answer} (${Math.round((total / answer) * 100) / 100} %)`)
  }, 10 * 1000)

  while (processing.length) {
    const fish = processing[0]

    let spawned = getFishCache(fish, cache)

    if (!spawned) {
      spawned = breed(fish, days)

      if (!cache[fish.birthday]) {
        cache[fish.birthday] = {}
      }

      if (!cache[fish.birthday][fish.cooldown]) {
        cache[fish.birthday][fish.cooldown] = []
      }

      cache[fish.birthday][fish.cooldown] = spawned
    }

    spawned.forEach(o => {
      total++;
      if (o.birthday + o.cooldown > days) {
        return // If it takes longer to spawn than days left, dont bother adding it
      }
      processing.push(o);
    })

    if (Date.now() - last > 10000) {
      last = Date.now()
      console.log(`Current fish: ${total} / ${answer} (${Math.round((total / answer) * 100) / 100} %)`)
    }

    processing.splice(0, 1)
  }

  console.log(total)
  return total
}

function partTwo(input) {

  const initialFish = input.map(o => { return { birthday: 0, cooldown: Number(o) } })

  let processing = initialFish.slice()

  // Day[cooldown] = [] <- fish array
  let cache = {}

  let last = Date.now()

  const answer = 26984457539

  const total = { total: initialFish.length }

  for (let i = 0; i < initialFish.length; i++) {
    const fish = initialFish[i];
    deepBreed(fish, days, cache, total)
  }

  console.log(total)
  return total
}

function deepBreed(fish, days, tree, total) {
  const cached = getFishCache(fish, tree)
  if (cached) {
    // Already done this part - return here
    total.total += cached.length
    return cached
  }

  if (fish.birthday + fish.cooldown > days) {
    return []
  }

  const bred = breed(fish, days)

  if (!tree[fish.birthday]) {
    tree[fish.birthday] = {}
  }
  if (!tree[fish.birthday][fish.cooldown]) {
    tree[fish.birthday][fish.cooldown] = []
  }
  tree[fish.birthday][fish.cooldown] = bred

  const masterList = tree[fish.birthday][fish.cooldown]

  for (let i = 0; i < bred.length; i++) {
    const offspring = bred[i];
    const res = deepBreed(offspring, days, tree, total)
    res.forEach(o => {
      if (!containsFish(masterList)) {
        masterList.push(o)
      }
    })
    //tree[fish.birthday][fish.cooldown].push(...res)
  }
  return bred;
}

function containsFish(arr, o){
  return arr.indexOf(x => x.birthday === o.birthday && x.cooldown === o.cooldown && x.parent === o.parent) > -1
}

function getFishCache(fish, cache) {
  if (cache[fish.birthday]) {
    return cache[fish.birthday][fish.cooldown]
  }
}

async function start() {
  const numbers = getInput(`${__dirname}/day-6.txt`)
  const input = numbers[0].split(',')
  const task1 = await timeFunction(() => partOne(input))
  const task2 = await timeFunction(() => partTwo(input))
  console.log([{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }])
}

module.exports = start

start()