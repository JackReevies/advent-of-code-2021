use std::fs;

fn main() {
  let contents = fs::read_to_string("./input.txt").expect("Something went wrong reading the file");
  let vec: Vec<i32> = contents.lines().map(|x| x.parse::<i32>().unwrap()).collect();

  let count = vec.len();
  let mut increase_counter = 0;
  let mut last_three_sum: i32 = (&vec[0..3]).iter().sum(); // vec[from inc..to exc]
  let mut i = 4; // Start at 4 because we already consider the first 3 items
  while i < count + 1 {
    let three_sum: i32 = (&vec[i - 3..i]).iter().sum();
    
    if three_sum > last_three_sum {
      increase_counter += 1;
      println!("Three Sum: {} (increased)", three_sum);
    } else if three_sum == last_three_sum {
      println!("Three Sum: {} (no change)", three_sum);
    } else {
      println!("Three Sum: {} (decreased)", three_sum);
    }
    last_three_sum = three_sum;
    i += 1;
  }

  println!("Increase Count: {}", increase_counter)
}
