import BrowserClient from '../../browserClient/BrowserClient.client';

export default class InjectionHandler {
  private browserClient: BrowserClient;

  constructor(browserClient: BrowserClient) {
    this.browserClient = browserClient;
  }

  modifyCaptchaShow = async () => {
    await this.browserClient.getPage()!.evaluate(this.fn);
    await this.browserClient.getPage()!.evaluate(`
      Object.defineProperty(Captcha, "show", {
        value: newShowFn,
        writable: true,
        enumerable: true,
        configurable: true
      })
    `);

  }

  fn = `function newShowFn(a) {
    console.log("captcha object is", a)
    touch_hold = !1;
    var b = 0
      , b = "undefined" != typeof a.penalty ? a.penalty : players[0].params.penalty
      , b = {
        penalty_points_color: Captcha.penalty_points_color(b),
        captcha_points: -b
    };
    Captcha.active = !0;
    FormHelper.get_form("captcha").content.innerHTML = HandlebarTemplate.captcha()(b);
    if (mobileDevice())
        try {
            swapElements(document.getElementById("captcha_timer"), document.getElementById("captcha_holder")),
            swapElements(document.getElementById("captcha_img_holder"), document.getElementById("captcha_refresh"))
        } catch (d) {}
    touch_initialized && (document.getElementById("captcha_toggle_numpad").style.display = "none",
    document.getElementById("captcha_input").style.marginLeft = "0px");
    Captcha.set_captcha_image(a);
    Captcha.start_interval();
    12 == current_map && Popup.dialog(_ti("This is a captcha! It is used to make sure you are not a robot.") + " " + _ti("They will appear randomly while your character is performing actions.") + " " + _ti("If you fail too many captchas, your character will be jailed."), function() {});
    Notifications.show(_ti("An anti-bot captcha challenge has appeared! Do not miss these!"));
    SpectateWindow.captcha();
    document.getElementById("captcha_input").focus();
    preventBackButtonClose();
    "1" == LStorage.get("numpad") && Captcha.show_numpad()
  }`
}
