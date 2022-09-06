use serde::Serialize;
use yew::{ html,Callback, function_component, use_state, Properties };
use yew::TargetCast;
use yew::events::{FocusEvent,Event};
use web_sys::HtmlInputElement;
use gloo_net::http::Request;
use wasm_bindgen_futures::spawn_local;
use gloo::console::console_dbg;

#[derive(Properties,PartialEq)]
pub struct LoginControlProps{
  pub cancel_login: Callback<()>,
  login: Callback<(String, String)>,
}

#[derive(Serialize)]
struct LoginForm{
  account: String,
  password: String,
}

#[function_component(BottomNav)]
pub fn bottom_nav() -> Html{
  let model_control = use_state(|| false);
  
  let login = {
    let model_control = model_control.clone();
    Callback::from(move |(account,password):(String,String)| {
      let url = "http://localhost:3000/api/user/login";
      // let account = JsValue::from_str(&account);
      // let password = JsValue::from_str(&password);
      let login_form = LoginForm{
        account,
        password,
      };
      spawn_local(async move {
        let resp = Request::post(url).json(&login_form).unwrap().send().await.unwrap();
        let res = resp.text().await.unwrap();
        console_dbg!(&res);
      });
      model_control.set(false);
    })
  };
  let is_login = use_state(|| false);
  let login_handler = {
    let model_control = model_control.clone();
    let is_login = is_login.clone();
    move |_| {
      model_control.set(true);
      is_login.set(true);
    }
  };
  let login_out_handler = {
    let is_login = is_login.clone();
    move |_| {
      is_login.set(false);
      //todo! localStorage.clear()
    }
  };

  let cancel_login = {
    let model_control = model_control.clone();
    let is_login = is_login.clone();
    Callback::from(move |_| {
      model_control.set(false);
      is_login.set(false);
    })
  };
  html! {
    <>
    <div class="bottom-nav">
      <div class="m-container"></div>
      <div class="inner-box">
        <div class="left">
          <div class="home flex">{"首页"}</div>
          <div class="selected flex">{"已选"}</div>
          <div class="addvolume flex">{"音量+"}</div>
          <div class="reducevolume flex">{"音量-"}</div>
        </div>
        <div class="middle">
          <img src="" alt=""/>
          <div class="control-btn flex">
            <div class="prev-btn">{"上一曲"}</div>
            <div class="play">{"播放"}</div>
            <div class="next-btn">{"下一曲"}</div>
          </div>
        </div>
        <div class="right">
          <div class="minormax">
              <div>{"图标"}</div>
              <div>{"静音"}</div>
          </div>
          <div class="single-cycle" >
              <div>{"单曲"}</div>
          </div>
          <div class="order-cycle" >
              <div>{"顺序"}</div>
          </div>
          <div class="login">
            {
              html!{
                if *is_login {
                  <span>
                    <div onclick={login_out_handler}>{"下机"}</div>
                  </span>
                }else{
                  <span>
                    <div onclick={login_handler}>{"登录"}</div>
                  </span>
                }
              }
            }
          </div>
        </div>
      </div>
      <audio autoplay={true} id="musicPlayer"  src="http://localhost:3000/api/music/nowmusic?" preload="auto"></audio>
      </div>
      <div>
        {
          if *model_control {
            html!{<ModelView login={login} cancel_login = {cancel_login}/>}
          }else{
            html!{}
          }
        }              
      </div>
      </>
  }
}

#[function_component(ModelView)]
pub fn model_view(props:&LoginControlProps) -> Html{
  let account = use_state(|| String::from(""));
  let password = use_state(|| String::from(""));

  let cancel = {
    let cancel_login = props.cancel_login.clone();
    move |_| cancel_login.emit(())
  };

  let target_input_value = |e: &Event| {
    let input: HtmlInputElement = e.target_unchecked_into();
    input.value()
  };
  let onblur = {
    let account = account.clone();
    move |e: FocusEvent| {
        let value = target_input_value(&e);
        account.set(value);
    }
  };
  let onblur2 = {
    let password = password.clone();
    move |e: FocusEvent| {
        let value = target_input_value(&e);
        password.set(value);
    }
  };
  let login = {
    let login = props.login.clone();
    move |_| login.emit((account.to_string(),password.to_string()))
  };
  html!{
    <div class="my-modal">
            <div class="modal-background"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title">{"请登录"}</p>
                <button class="delete" aria-label="close" onclick={cancel.clone()}></button>
              </header>
              <section class="modal-card-body">
                <div class="field">
                  <p class="control has-icons-left has-icons-right">
                    <input class="input" type="email" placeholder="账号" {onblur} />
                    <span class="icon is-small is-left">
                      <i class="fas fa-envelope"></i>
                    </span>
                    <span class="icon is-small is-right">
                      <i class="fas fa-check"></i>
                    </span>
                  </p>
                </div>
                <div class="field">
                  <p class="control has-icons-left">
                    <input class="input" type="password" placeholder="密码" onblur={onblur2}/>
                    <span class="icon is-small is-left">
                      <i class="fas fa-lock"></i>
                    </span>
                  </p>
                </div>
              </section>
              <footer class="modal-card-foot">
                <button class="button is-success" onclick={login}>{"登录"}</button>
                <button class="button" onclick={cancel}>{"取消"}</button>
              </footer>
            </div>
        </div>
  }
}
