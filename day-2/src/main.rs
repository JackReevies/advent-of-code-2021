use std::fs;

fn main() {
  part1();
  part2();
}

fn part1() {
  let contents = fs::read_to_string("./input.txt").expect("Something went wrong reading the file");
  let arr = contents.lines();

  let mut depth: i32 = 0;
  let mut horizontal: i32 = 0;

  for instruction in arr {
    if instruction.starts_with("forward") {
      horizontal += instruction.replace("forward ", "").parse::<i32>().unwrap()
    } else if instruction.starts_with("down") {
      depth += instruction.replace("down ", "").parse::<i32>().unwrap()
    } else if instruction.starts_with("up") {
      depth -= instruction.replace("up ", "").parse::<i32>().unwrap()
    }
  }

  println!("Part 1: {} depth * {} horizontal = {}", depth, horizontal, depth * horizontal)
}

fn part2() {
  let contents = fs::read_to_string("./input.txt").expect("Something went wrong reading the file");
  let arr = contents.lines();

  let mut depth: i32 = 0;
  let mut horizontal: i32 = 0;
  let mut aim: i32 = 0;

  for instruction in arr {
    if instruction.starts_with("forward") {
      let num = instruction.replace("forward ", "").parse::<i32>().unwrap();
      horizontal += num;
      depth += aim * num;
    } else if instruction.starts_with("down") {
      aim += instruction.replace("down ", "").parse::<i32>().unwrap();
    } else if instruction.starts_with("up") {
      aim -= instruction.replace("up ", "").parse::<i32>().unwrap();
    }
  }

  println!("Part 2: {} depth * {} horizontal = {}", depth, horizontal, depth * horizontal)
}
