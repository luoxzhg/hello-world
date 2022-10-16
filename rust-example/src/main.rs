use std::io::Write;
use std::cmp::Ordering;
use rand::Rng;
fn main() {
    println!("猜数字!");
    let secret_number = rand::thread_rng().gen_range(1..=100);
    loop {
        print!("输入你猜的数字：");
        std::io::stdout().flush().unwrap();
        let mut guess = String::new();
        std::io::stdin().read_line(&mut guess).expect("Failed");
        let guess = match guess.trim().parse::<i64>() {
            Ok(n) => n,
            Err(_) => continue,
        };

        println!("你猜的数字：{guess}");
        match guess.cmp(&secret_number) {
            Ordering::Less => println!("Too Small"),
            Ordering::Greater => println!("Too Big"),
            Ordering::Equal => {
                println!("猜对了！");
                break;
            }
        }
    }
}
