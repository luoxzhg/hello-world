mod utils;

use similar::{ChangeTag, TextDiff};
// use levenshtein_diff::{self, apply_edits, levenshtein_memoization};

use utils::set_panic_hook;
use wasm_bindgen::prelude::*;

// // When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// // allocator.
// #[cfg(feature = "wee_alloc")]
// #[global_allocator]
// static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// #[wasm_bindgen]
// extern "C" {
//     fn alert(s: &str);
// }

// #[wasm_bindgen]
// pub fn greet() {
//     alert("Hello, diff-wasm!");
// }

// pub fn leven_diff(old: &str, new: &str) -> Vec<char>{
//     let source = &old.chars().collect::<Vec<char>>();
//     let target = &new.chars().collect::<Vec<char>>();
//     let (distance, distance_matrix) = levenshtein_memoization(source, target);
//     println!("distance = {}", distance);
//     let result = levenshtein_diff::generate_edits(source, target, &distance_matrix).unwrap();

//     println!("{:#?}", &distance_matrix);
//     for edit in &result {
//         match edit {
//             levenshtein_diff::Edit::Delete(x) => println!("delete {}", x),
//             levenshtein_diff::Edit::Insert(x, t) => println!("insert {} char {}", x, t),
//             levenshtein_diff::Edit::Substitute(x, t) => println!("replace {} char {}", x, t)
//         }
//     }
//     return apply_edits(source, &result);
// }


#[wasm_bindgen]
pub fn diff(old: &str, new: &str) -> String {
    set_panic_hook();
    // let mut text_diff = TextDiff::configure();
    // text_diff.timeout(Duration::from_secs(60));
    // let res = text_diff.diff_unicode_words(old, new);

    // let res = TextDiff::from_chars(old, new);
    let res = TextDiff::from_unicode_words(old, new);
    // let res = TextDiff::configure().algorithm(similar::Algorithm::Patience).diff_chars(old, new);

    let mut v = vec![];

    for item in res.iter_all_changes() {
        // println!("{:?}", item);
        v.push(DiffItem::new(
            item.tag(),
            item.value(),
        ))
    }

    // println!("{:?}", v);
    serde_json::to_string(&v).unwrap()
}

#[wasm_bindgen]
pub fn diff_slices(old: Vec<String>, new: Vec<String>) ->String {
    set_panic_hook();
    let source = old.iter().map(|s| s.as_str()).collect::<Vec<&str>>();
    let target = new.iter().map(|s| s.as_str()).collect::<Vec<&str>>();

    _diff_slices(&source, &target)
}

fn _diff_slices(old: &[&str], new: &[&str]) ->String {
    let res = TextDiff::from_slices(old, new);
    let mut v = vec![];
    for item in res.iter_all_changes() {
        println!("{:?}", item);
        v.push(DiffItem::new(item.tag(), item.value()))
    }
    serde_json::to_string(&v).unwrap()
}

#[derive(Debug, PartialEq, Default, Clone, serde::Serialize)]
pub struct DiffItem {
    tag: String,
    value: String,
}

impl DiffItem {
    fn new(tag: ChangeTag, value: &str) -> DiffItem {
        let tag = match tag {
            ChangeTag::Delete => "deleted",
            ChangeTag::Equal => "equal",
            ChangeTag::Insert => "inserted",
        };
        DiffItem {
            tag: String::from(tag),
            value: String::from(value),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn diff_slices_should_work() {
        let old = vec![
            String::from("达到啊，"),
            String::from("多多的。"),
            String::from("do"),
            String::from("i"),
            String::from("should"),
            String::from("do")];

        let new = vec![
            String::from("到达，"),
            String::from("多多的。"),
            String::from("may"),
            String::from("you"),
            String::from("should"),
            String::from("do")];

        let res = diff_slices(old, new);

        println!("{}", res)
    }


    // #[test]
    // fn leven_diff_works() {
    //     let old = "ABDbDD";
    //     let new = "ACcDD";
    //     let result = leven_diff(old, new);
    //     println!("{:#?}", result)
    // }

    #[test]
    fn it_works() {
        let old = "A-BC《CD：2021》大大多多";
        let new = "A CB《CD：2021》多多大大";
        let result = diff(old, new);
        println!("{}", result);
    }

    #[test]
    fn it_should_delete() {
        let old = "ACcCD";
        let new = "AbBCD";
        let result = diff(old, new);
        println!("{}", result);
    }
}
