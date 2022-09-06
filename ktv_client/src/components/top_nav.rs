use yew::{ Component, Context, Html, html, Properties };


#[derive(Properties, PartialEq, Default)]
pub struct TopNavProps {
    pub current_song: String,
    pub next_song: String,
    pub all_music_list: usize,
}
pub struct TopNav {}

impl Component for TopNav {
    type Message = ();
    type Properties = TopNavProps;

    fn create(_ctx: &Context<Self>) -> Self {
        Self {}
    }
    fn view(&self, ctx: &Context<Self>) -> Html {    
        let current_song = if ctx.props().current_song != "" {
          "正在播放：".to_string() + &ctx.props().current_song
        } else {
          "正在播放：".to_string() + &"no".to_string()
        };
        let next_song = if ctx.props().next_song != "" {
          "下一首：".to_string() + &ctx.props().next_song
        } else {
          "下一首：".to_string() + &"无".to_string()
        };
        let all_music_list = if ctx.props().all_music_list != 0 {
          "已选：".to_string() + &ctx.props().all_music_list.to_string()
        } else {
          "已选：".to_string() + &"0".to_string()
        };
        html! {
            <div class="columns top-nav">
              <div class="column is-3 flex">
                <div class="logo"></div>
              </div>
              <div class="column is-3 flex">
                <div class="playing-name flex">
                  {current_song}
                </div>
              </div>
              <div class="column is-3 flex">
                <div class="next-name flex">
                  {next_song}
                </div>
              </div>
              <div class="column is-3 flex">
                <div class="selected-name flex">
                  {all_music_list}
                </div>
              </div>
            </div>
        }
    }
}