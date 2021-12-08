const { timeFunction, getInput } = require('./common')

function partOne(input) {
  for (let i = 0; i < input.draws.length; i++) {
    const draw = input.draws[i];

    eliminateMatches(input.boards, draw)
    const winner = checkForWin(input.boards)
    if (winner) {
      return calculateScore(winner.board, draw)
    }
  }
}

function eliminateMatches(boards, number) {
  for (let i = 0; i < boards.length; i++) {
    const board = boards[i];

    for (let z = 0; z < board.length; z++) {
      const row = board[z];

      for (let x = 0; x < row.length; x++) {
        const rowNumber = row[x];

        if (rowNumber === number) {
          row[x] = null
        }
      }
    }
  }
}

function checkForWin(boards) {
  for (let i = 0; i < boards.length; i++) {
    const board = boards[i];

    if (doesBoardHaveAWinner(board)) {
      return { board, index: i }
    }
  }
}

function doesBoardHaveAWinner(board) {
  const rowWinner = board.some(row => checkRow(row));

  if (rowWinner) {
    return true
  }

  for (let i = 0; i < board[0].length; i++) {
    if (checkRow(createRowFromColumn(board, i))) {
      return true
    }
  }
}

function createRowFromColumn(board, columnIndex) {
  let virtualRow = []
  for (let i = 0; i < board.length; i++) {
    const row = board[i];

    virtualRow.push(row[columnIndex])
  }
  return virtualRow
}

function checkRow(row) {
  for (let x = 0; x < row.length; x++) {
    const num = row[x];
    if (num !== null) {
      return false
    }
  }
  return true
}

function calculateScore(board, winningDraw) {
  let sum = 0
  for (let iRow = 0; iRow < board.length; iRow++) {
    const row = board[iRow];

    for (let iColumn = 0; iColumn < row.length; iColumn++) {
      const number = row[iColumn];

      if (number) {
        sum += Number(number)
      }
    }
  }

  return sum * Number(winningDraw)
}

function partTwo(input) {
  const winningBoards = []
  for (let i = 0; i < input.draws.length; i++) {
    const draw = input.draws[i];

    eliminateMatches(input.boards, draw)

    while (true) {
      const winner = checkForWin(input.boards)

      if (!winner) {
        break
      }

      winningBoards.push(winner.board)
      input.boards.splice(winner.index, 1)
    }

    if (!input.boards.length) {
      return calculateScore(winningBoards[winningBoards.length - 1], draw)
    }
  }
}

function interpretInput(input) {
  const draws = input[0].split(",")
  input.splice(0, 1)

  const boards = []
  let board = []
  for (let i = 1; i < input.length; i++) {
    const line = input[i];
    if (i % 6 == 0) {
      boards.push(board)
      board = []
    } else {
      const numbers = line.matchAll(/(\d+)/g)
      board.push([...numbers].map(o => o[0]))
    }
  }

  boards.push(board)

  return { draws, boards }
}

async function start() {
  const numbers = getInput(`${__dirname}/day-4.txt`)
  const input = interpretInput(numbers)

  const task1 = await timeFunction(() => partOne(input))
  const task2 = await timeFunction(() => partTwo(input))
  console.log([{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }])
}

module.exports = start

start()