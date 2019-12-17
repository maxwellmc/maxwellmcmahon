// Vendors
import 'bootstrap';

// Layout
import './layout';

// ScrollMagic
import * as ScrollMagic from "scrollmagic"; // Or use scrollmagic-with-ssr to avoid server rendering problems
import { TweenMax, TimelineMax } from "gsap"; // Also works with TweenLite and TimelineLite
import { ScrollMagicPluginGsap } from "scrollmagic-plugin-gsap";

class App {

  initScrollMagic(){

    ScrollMagicPluginGsap(ScrollMagic, TweenMax, TimelineMax);

    // Create the controller
    var controller = new ScrollMagic.Controller({globalSceneOptions: {triggerHook: "onEnter", duration: "200%"}});

    // Build scenes
    new ScrollMagic.Scene({triggerElement: "#parallax1"})
      .setTween("#parallax1 > div", 1, {y: "50%", ease: Linear.easeNone})
      // <!-- .addIndicators() -->
      .addTo(controller);
    new ScrollMagic.Scene({triggerElement: "#parallax2"})
      .setTween("#parallax2 > div", 1, {y: "50%", ease: Linear.easeNone})
      // <!-- .addIndicators() -->
      .addTo(controller);
    new ScrollMagic.Scene({triggerElement: "#parallax3"})
      .setTween("#parallax3 > div", 1, {y: "70%", ease: Linear.easeNone})
      // <!-- .addIndicators() -->
      .addTo(controller);
  }

  init(){
    this.initScrollMagic();
  }
}

const app = new App();
app.init();
