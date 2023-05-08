mod front_of_house {
   pub(crate) mod hosting {
      pub(crate) fn add_to_waitlist() {}

      fn seat_at_table() {}
   }

   mod serving {
      fn take_order() {}

      fn serve_order() {}

      fn take_payment() {}
   }
}

use front_of_house::hosting;
use back_of_house::{Breakfast, Appetizer};
pub fn eat_at_restaurant() {
   // hosting::seat_at_table();
   let mut meal = Breakfast::summer("Rye");
   meal.toast = String::from("Wheat");
   println!("I would like {} toast please", meal.toast);
   let order1 = Appetizer::Soup;
   let order2 = Appetizer::Salad;
}

fn deliver_order() {}

mod back_of_house {
   fn fix_incorrect_order() {
      cook_oerder();
      super::deliver_order();
   }

   fn cook_oerder() {}

   pub enum Appetizer {
      Soup,
      Salad,
   }

   pub struct Breakfast {
      pub toast: String,
      season_fruit: String
   }

   impl Breakfast {
      pub fn summer(toast: &str) ->Breakfast {
         Breakfast { toast: String::from(toast), season_fruit: String::from("peaches") }
      }
   }
}

pub fn add(left: usize, right: usize) -> usize {
   left + right
}

#[cfg(test)]
mod tests {
   use super::*;

   #[test]
   fn it_works() {
      let result = add(2, 2);
      assert_eq!(result, 4);
   }
}
