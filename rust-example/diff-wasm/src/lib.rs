mod utils;

use similar::{ChangeTag, TextDiff};

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

#[wasm_bindgen]
pub fn diff(old: &str, new: &str) -> String {
    set_panic_hook();
    // let mut text_diff = TextDiff::configure();
    // text_diff.timeout(Duration::from_secs(60));
    // let res = text_diff.diff_unicode_words(old, new);

    let res = TextDiff::from_chars(old, new);

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
    fn it_works() {
        let old = "ABCCD";
        let new = "ACBCD";
        let result = diff(old, new);
        println!("{}", result);
    }

    #[test]
    fn it_should_delete() {
        let old = "ACD";
        let new = "ABCD";
        let result = diff(old, new);
        println!("{}", result);
    }
}
