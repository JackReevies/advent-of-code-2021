use std::fs;

fn main() {
  //part1();
  part2();
}

fn part1() {
  let contents = fs::read_to_string("./input.txt").expect("Something went wrong reading the file");
  let arr: Vec<&str> = contents.lines().collect();

  let width = 5;
  let mut i = 0;

  let mut gamma_rate: String = "".to_string();
  let mut epsilon_rate: String = "".to_string();

  while i < width {
    let mut ones_count = 0;
    let mut zeros_count = 0;
    for bin in arr.iter() {
      let bits: Vec<char> = bin.chars().collect();
      if bits[i] == '1' {
        ones_count += 1;
      } else {
        zeros_count += 1;
      }
    }
    if ones_count > zeros_count {
      gamma_rate.push_str("1");
      epsilon_rate.push_str("0");
    } else {
      gamma_rate.push_str("0");
      epsilon_rate.push_str("1");
    }
    i+=1;
  }

  let gamma_num = isize::from_str_radix(&gamma_rate[..], 2).unwrap();
  let epsilon_num = isize::from_str_radix(&epsilon_rate[..], 2).unwrap();

  println!("gamma binary is {} and epsilon binary is {}", gamma_rate, epsilon_rate);
  println!("gamma number is {} and epsilon number is {}", gamma_num, epsilon_num);
  println!("answer is {}", gamma_num * epsilon_num);
}

fn part2() {
  let contents = fs::read_to_string("./input.txt").expect("Something went wrong reading the file");
  let arr: Vec<&str> = contents.lines().collect();

  let width = 12;
  let mut i: i32 = 0;
  
  let mut oxygen_num = 0;
  let mut co2_num = 0;

  let mut oxygen_vec: Vec<&str> = arr.to_vec();
  let mut co2_vec: Vec<&str> = arr.to_vec();

  while i < width {
    let mut ones_count = 0;
    let mut zeros_count = 0;
    for bin in oxygen_vec.clone() {
      let bits: Vec<char> = bin.chars().collect();
      if bits[i as usize] == '1' {
        ones_count += 1;
      } else {
        zeros_count += 1;
      }
    }
    if ones_count >= zeros_count {
      oxygen_vec = prune_vec(oxygen_vec, i, '1');
    } else {
      oxygen_vec = prune_vec(oxygen_vec, i, '0');
    }
    
    println!("printing oxygen_vec after iteration {}", i + 1);
    print_vec(oxygen_vec.to_vec());

    if oxygen_vec.len() == 1 {
      break;
    }

    i+=1;
  }

  oxygen_num = isize::from_str_radix(&oxygen_vec[0][..], 2).unwrap();

  i = 0;

  while i < width {
    let mut ones_count = 0;
    let mut zeros_count = 0;
    for bin in co2_vec.clone() {
      let bits: Vec<char> = bin.chars().collect();
      if bits[i as usize] == '1' {
        ones_count += 1;
      } else {
        zeros_count += 1;
      }
    }
    if ones_count >= zeros_count {
      co2_vec = prune_vec(co2_vec, i, '0');
    } else {
      co2_vec = prune_vec(co2_vec, i, '1');
    }
    
    println!("printing co2_vec after iteration {}", i + 1);
    print_vec(co2_vec.to_vec());

    if co2_vec.len() == 1 {
      break;
    }

    i+=1;
  }

  co2_num = isize::from_str_radix(&co2_vec[0][..], 2).unwrap();

  println!("oxygen_vec is {} (which is {})", oxygen_vec[0], oxygen_num);
  println!("co2_vec is {} (which is {})", co2_vec[0], co2_num);
  println!("final answer is {}", oxygen_num * co2_num);
}

fn prune_vec(vec: Vec<&str>, pos: i32, bit_value: char) -> Vec<&str> {
  let mut valid_bins: Vec<&str> = Vec::new();
  for bin in vec.iter() {
    let bits: Vec<char> = bin.chars().collect();
    if bits[pos as usize] == bit_value {
      valid_bins.push(bin);
    }
  }
  return valid_bins;
}

fn print_vec(vec: Vec<&str>){
  for x in vec {
    println!("{}", x)
  }
}