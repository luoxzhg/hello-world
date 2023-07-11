use blog::Post;

fn main() {
    let mut post = Post::new();

    post.add_text("一是是是是是是是");
    assert_eq!("", post.content());

    post.request_review();
    assert_eq!("", post.content());

    post.approve();
    assert_eq!("一是是是是是是是", post.content());
}
