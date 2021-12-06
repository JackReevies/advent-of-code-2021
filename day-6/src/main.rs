use std::fs;
use std::time::Instant;

fn main() {
    let now = Instant::now();
    // part1();
    part2();
    println!("{}", now.elapsed().as_millis());
}

fn part1() {
    let contents =
        fs::read_to_string("./input.txt").expect("Something went wrong reading the file");
    let lines: Vec<&str> = contents.split("\r\n").collect();

    let mut fish: Vec<i32> = lines[0]
        .split(',')
        .map(|x| x.parse::<i32>().unwrap())
        .collect();

    let days = 80;

    for x in 0..days {
        breed(&mut fish);
        //println!("Iteration {}", x);
        //println!("{:?}", &fish)
    }

    println!("There are {:?} fish", fish.len())
}

fn get_spawned_in_lifetime(fish: (i32, i32), lived: i32) -> Vec<(i32, i32)> {
    let mut offspring_vec: Vec<(i32, i32)> = Vec::new();
    let mut offspring = 0;
    let mut day: i32 = fish.0;
    // Firstly the initial state is going to be less than max
    day += fish.1 + 1;
    if day > lived {
        return offspring_vec;
    }
    offspring += 1;
    offspring_vec.push((day, 8));
    // Then every 7 days it'll spit out another fish
    while day < (lived - 6) {
        day += 7;
        offspring += 1;
        offspring_vec.push((day, 8));
    }
    return offspring_vec; // (((lived - day) / 7) + offspring) as i32;
}

fn breed(fish: &mut Vec<i32>) {
    for x in 0..fish.len() {
        fish[x] -= 1;
        if fish[x] == -1 {
            fish[x] = 6;
            fish.push(8);
        }
    }
}

fn part2() {
    let contents =
        fs::read_to_string("./input.txt").expect("Something went wrong reading the file");
    let lines: Vec<&str> = contents.split("\r\n").collect();

    let fish: Vec<i32> = lines[0]
        .split(',')
        .map(|x| x.parse::<i32>().unwrap())
        .collect();

    let mut fish2: Vec<(i32, i32)> = Vec::new();

    let day = 256;

    for x in 0..fish.len() {
        fish2.push((0, fish[x]));
    }

    let mut fish_to_process = fish2.clone();
    let mut total_fish = fish2.len();

    loop {
        // println!("Fishes are {:?}", fish_to_process);
        let mut new_fish: Vec<(i32, i32)> = Vec::new();
        for x in 0..fish_to_process.len() {
            let fi = fish_to_process[x];
            let spawned: Vec<(i32, i32)> = get_spawned_in_lifetime(fi, day);

            for x in 0..spawned.len() {
                new_fish.push(spawned[x])
            }

            //println!("{} spawned {} fish", x, spawned.len())
        }

        fish_to_process = new_fish.clone();
        total_fish += new_fish.len();
        new_fish.clear();

        if fish_to_process.len() == 0 {
            break;
        }
        println!("Total fish: {}", total_fish)
    }

    println!("there were a total of {} fish", total_fish);
}

fn recursive_breed() {}
