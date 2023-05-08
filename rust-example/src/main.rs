fn main() {
    let num = (4);

    let n = 1..=2;
    match num {
        x @ 4 => println!("number {}", x),
        _ => (),
    }
}
