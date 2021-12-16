const { timeFunction, getInput } = require('./common')

function partOne(lines) {
  const input = interpretInput(lines)
  const backup = input.slice()
  const start = Date.now()
  while (input.length) {
    doStep(input, input[0])
    const progress = ((backup.length - input.length) / backup.length) * 100
    const timeTaken = Date.now() - start
    const totalTime = timeTaken * (100 / progress)
    const timeLeft = totalTime - (Date.now() - start) 
    const eta = Date.now() + totalTime

    console.log(`${convertToTimestamp(timeLeft)} (nodes left to visit: ${input.length} / ${backup.length}) (ETA: ${convertToTimestamp(eta)})`)
  }

  console.log(`${backup.length} nodes took: ${convertToTimestamp(Date.now() - start)}`)
  return backup.find(o => o.x === lines.length - 1 && o.y === lines.length - 1).weight
}

function convertToTimestamp (time) {
  let upTime = time
  if (time < 0) return `${ time } ms`
  const days = Math.floor(upTime / (1000 * 60 * 60 * 24))
  upTime -= days * (1000 * 60 * 60 * 24)

  const hours = Math.floor(upTime / (1000 * 60 * 60))
  upTime -= hours * (1000 * 60 * 60)

  const mins = Math.floor(upTime / (1000 * 60))
  upTime -= mins * (1000 * 60)

  if (days === 0) {
    const seconds = Math.floor(upTime / (1000))
    upTime -= seconds * (1000)
    return `${ hours } hours, ${ mins } mins, ${ seconds } seconds`
  } else {
    return `${ days } days, ${ hours } hours, ${ mins } mins`
  }
}

function doStep(arr, considering) {
  for (let i = 0; i < considering.adjacents.length; i++) {
    const node = considering.adjacents[i];

    if (considering.explored.find(o => o === node.name)) continue

    if (node.weight > node.risk + considering.weight) {
      node.weight = node.risk + considering.weight
      node.via = considering.name
    }
    node.explored.push(considering.name)
  }

  considering.visited = true
  arr.splice(0, 1)
  arr.sort((a, b) => a.weight < b.weight ? -1 : 1)
}

function partTwo(input) {
  const newGrid = input.map(o => o.split("").map(o => Number(o)))
  const newGrid2 = []

  for (let z = 1; z < 5; z++) {
    const grid = []
    input.forEach((row, y) => {
      row = row.split("").map(o => Number(o))
      row.forEach((cell, x) => {
        if (!grid[y]) {
          grid[y] = []
        }
        grid[y][x] = cell + z > 9 ? cell + z - 9 : cell + z
      })
    })
    grid.forEach(newRow => {
      newGrid.push(newRow)
    })
  }

  for (let i = 0; i < newGrid.length; i++) {
    const row = newGrid[i];
    const nums = row
    let newNums = nums.slice()
    for (let z = 1; z < 5; z++) {
      newNums = [...newNums, ...nums.map(o => o + z > 9 ? o + z - 9 : o + z)]
    }
    newGrid2.push(newNums)
  }

  //validateExample(newGrid2.map(o => o.join("")))
  return partOne(newGrid2.map(o => o.join("")))
}

function validateExample(newGrid) {
  const answer = `11637517422274862853338597396444961841755517295286
13813736722492484783351359589446246169155735727126
21365113283247622439435873354154698446526571955763
36949315694715142671582625378269373648937148475914
74634171118574528222968563933317967414442817852555
13191281372421239248353234135946434524615754563572
13599124212461123532357223464346833457545794456865
31254216394236532741534764385264587549637569865174
12931385212314249632342535174345364628545647573965
23119445813422155692453326671356443778246755488935
22748628533385973964449618417555172952866628316397
24924847833513595894462461691557357271266846838237
32476224394358733541546984465265719557637682166874
47151426715826253782693736489371484759148259586125
85745282229685639333179674144428178525553928963666
24212392483532341359464345246157545635726865674683
24611235323572234643468334575457944568656815567976
42365327415347643852645875496375698651748671976285
23142496323425351743453646285456475739656758684176
34221556924533266713564437782467554889357866599146
33859739644496184175551729528666283163977739427418
35135958944624616915573572712668468382377957949348
43587335415469844652657195576376821668748793277985
58262537826937364893714847591482595861259361697236
96856393331796741444281785255539289636664139174777
35323413594643452461575456357268656746837976785794
35722346434683345754579445686568155679767926678187
53476438526458754963756986517486719762859782187396
34253517434536462854564757396567586841767869795287
45332667135644377824675548893578665991468977611257
44961841755517295286662831639777394274188841538529
46246169155735727126684683823779579493488168151459
54698446526571955763768216687487932779859814388196
69373648937148475914825958612593616972361472718347
17967414442817852555392896366641391747775241285888
46434524615754563572686567468379767857948187896815
46833457545794456865681556797679266781878137789298
64587549637569865174867197628597821873961893298417
45364628545647573965675868417678697952878971816398
56443778246755488935786659914689776112579188722368
55172952866628316397773942741888415385299952649631
57357271266846838237795794934881681514599279262561
65719557637682166874879327798598143881961925499217
71484759148259586125936169723614727183472583829458
28178525553928963666413917477752412858886352396999
57545635726865674683797678579481878968159298917926
57944568656815567976792667818781377892989248891319
75698651748671976285978218739618932984172914319528
56475739656758684176786979528789718163989182927419
67554889357866599146897761125791887223681299833479`

  const grid = answer.split("\n")
  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    const ourRow = newGrid[i]

    if (row !== ourRow) {
      console.log('ouch')
    }
  }
  console.log()
}

function expandRow() {
  for (let i = 0; i < input.length; i++) {
    const row = input[i];
    const nums = row.split("").map(o => Number(o))
    let newNums = nums.slice()
    for (let z = 1; z < 5; z++) {
      newNums = [...newNums, ...nums.map(o => o + z > 9 ? o + z - 9 : o + z)]
    }
    newGrid.push(newNums)
  }
}

function getCoord(input, x, y) {
  if (input[y]) {
    if (input[y][x] || input[y][x] === 0) {
      return input[y][x]
    }
  }
}

function interpretInput(input) {
  const grid = input.map((o, i) => o.split("").map((o, x) => { return { x: x, y: i, risk: Number(o), name: `${ x }, ${ i }`, weight: Number.POSITIVE_INFINITY, explored: [] } }))

  const arr = []
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      const node = row[x];
      node.adjacents = [
        getCoord(grid, x - 1, y),
        getCoord(grid, x + 1, y),
        getCoord(grid, x, y - 1),
        getCoord(grid, x, y + 1),
      ].filter(o => o)

      if (node.x === 0 && node.y === 0) {
        node.weight = 0
      }

      arr.push(node)
    }
  }

  return arr
}

async function start() {
  const lines = getInput(`${__dirname}/day-15.txt`)
  const task1 = await timeFunction(() => partOne(lines))
  const task2 = await timeFunction(() => partTwo(lines))
  console.log(JSON.stringify([{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]))
}

module.exports = start

start()