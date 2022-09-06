use yew::{Component, Context, Html, html};

pub struct F404 {}

impl Component for F404 {
    type Message = ();
    type Properties = ();

    fn create(_ctx: &Context<Self>) -> Self {
        Self {}
    }
    fn view(&self, _ctx: &Context<Self>) -> Html {
        html! {
            <div class="block">
                <p class="title">{"404 找不到页面"}</p>
            </div>
        }
    }
}
