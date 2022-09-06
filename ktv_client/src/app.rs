use yew::prelude::*;
use crate::components::{f404::F404,top_nav::TopNav,bottom_nav::BottomNav};
pub struct App {}
impl Component for App {
    type Message = ();
    type Properties = ();

    fn create(_ctx: &Context<Self>) -> Self {
        Self {}
    }
    fn view(&self, _ctx: &Context<Self>) -> Html {
        html! {
            <div>
                <TopNav current_song={"你好".to_string()} next_song={"晴天".to_string()} all_music_list={2}/>
                <BottomNav />
                <F404 />
            </div>
        }
    }
}
