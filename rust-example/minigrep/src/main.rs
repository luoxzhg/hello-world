use std::{env, process, thread};

use minigrep::Config;

fn main() {
    let s: &str = &String::from("a");
    let mut y = Box::new(A{ value: 5});
    y.value = 10;

    // let mut list = vec![1, 2, 3];
    // println!("Before defining closure: {:?}", list);

    // thread::spawn(move || println!("From thread: {:?}", list))
    //     .join()
    //     .unwrap();

    // let config = Config::build(env::args()).unwrap_or_else(|err| {
    //     eprintln!("Problem parsing arguments: {err}");
    //     process::exit(1);
    // });

    // if let Err(e) = minigrep::run(&config) {
    //     eprintln!("Application error {e}");
    //     process::exit(1);
    // }
}

struct A{
    value: i32,
}
