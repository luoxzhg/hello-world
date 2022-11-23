fn longest<'a>(s1: &'a str, s2: &'a str) ->&str {
    let mut longest = s1;
    if s2.len() > s1.len() {
        longest = s2;
    }
    longest
}

fn main() {

}
