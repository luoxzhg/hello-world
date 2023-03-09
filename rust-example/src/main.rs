fn longest<'a>(s1: &'a str, s2: &'a str) -> &'a str {
   let mut longest = s1;
   if s2.len() > s1.len() {
      longest = s2;
   }
   longest
}

fn main() {
   let mut a = 5;
   let b = 0;
}
