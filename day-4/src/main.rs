use std::fs;
use std::time::{Instant};

fn main() {
    let now = Instant::now();
    part1();
    part2();
    println!("{}", now.elapsed().as_millis());
}

fn part1() {
    let contents =
        fs::read_to_string("./input.txt").expect("Something went wrong reading the file");
    let lines: Vec<&str> = contents.split("\r\n").collect();

    let draws: Vec<i8> = lines[0]
        .split(',')
        .map(|x| x.parse::<i8>().unwrap())
        .collect();

    let mut boards = create_boards(lines);

    for num in draws {
        boards = eliminate_matches(boards, num);
        let winner_index = check_for_winner(&boards);
        if winner_index > -1 {
            let score = calculate_score(&boards[winner_index as usize], num);
            println!(
                "Part 1: Winning board is {} with a score of {}",
                winner_index + 1,
                score
            );
            return;
        }
    }
}

fn part2() {
    let contents =
        fs::read_to_string("./input.txt").expect("Something went wrong reading the file");
    let lines: Vec<&str> = contents.split("\r\n").collect();

    let draws: Vec<i8> = lines[0]
        .split(',')
        .map(|x| x.parse::<i8>().unwrap())
        .collect();

    let mut boards = create_boards(lines);

    for num in draws {
        boards = eliminate_matches(boards, num);
        loop {
            let winner_index = check_for_winner(&boards);
            if winner_index == -1 {
                break;
            }
            let score = calculate_score(&boards[winner_index as usize], num);
            boards.splice(winner_index as usize..winner_index as usize + 1, []);
            if boards.len() == 0 {
                println!("Part 2: Board won with a score of {}", score);
            }
        }
    }
}

fn create_boards(lines: Vec<&str>) -> Vec<Vec<i8>> {
    let mut boards: Vec<Vec<i8>> = Vec::new();
    let mut board: Vec<i8> = Vec::new();
    let mut i: i32 = 0;
    for line in lines {
        i += 1;
        if i < 3 {
            continue;
        }
        if (i + 4) % 6 == 0 {
            boards.push(board.to_vec());
            board.clear();
            continue;
        }

        let no_doubles = line.replace("  ", " ");
        let mut row: Vec<&str> = no_doubles.split(" ").collect();

        if row[0] == "" {
            row.splice(0..1, []);
        }

        for number in row {
            board.push(number.parse::<i8>().unwrap())
        }
    }

    boards.push(board.to_vec());
    return boards;
}

fn eliminate_matches(mut boards: Vec<Vec<i8>>, number: i8) -> Vec<Vec<i8>> {
    let mut i = 0;
    while i < boards.len() {
        let mut x = 0;
        while x < boards[i].len() {
            if boards[i][x] == number {
                boards[i][x] = -1
            }
            x += 1;
        }
        i += 1;
    }
    return boards;
}

fn check_for_winner(boards: &Vec<Vec<i8>>) -> i8 {
    let mut i = 0;
    while i < boards.len() {
        if check_board(&boards[i]) {
            return i.try_into().unwrap();
        }
        i += 1;
    }
    return -1;
}

fn check_board(board: &Vec<i8>) -> bool {
    let mut row = 0;
    while row < 5 {
        let mut row_win = true;
        let mut column = 0;
        while column < 5 {
            if board[column + (row * 5)] != -1 {
                row_win = false;
            }
            column += 1;
        }

        if row_win {
            return true;
        }
        row += 1;
    }

    let mut column = 0;

    while column < 5 {
        let mut column_win = true;
        let mut i = 0;
        while i < 5 {
            if board[(i * 5) + column] != -1 {
                column_win = false;
            }
            i += 1;
        }

        if column_win {
            return true;
        }
        column += 1;
    }

    return false;
}

fn calculate_score(board: &Vec<i8>, winning_draw: i8) -> i32 {
    let mut x = 0;
    let mut sum: i32 = 0;
    while x < board.len() {
        if board[x] != -1 {
            sum = sum + board[x] as i32;
        }
        x += 1;
    }
    return sum * winning_draw as i32;
}

fn print_vec(vec: Vec<i8>) {
    for x in vec {
        print!("{},", x);
    }
    println!("");
}

fn print_vec_vec(vec: Vec<Vec<i8>>) {
    for x in vec {
        for i in x {
            print!("{},", i);
        }
        println!("");
    }
}

fn print_vec_u8(vec: Vec<u8>) {
    for x in vec {
        print!("{},", x);
    }
    println!("");
}
