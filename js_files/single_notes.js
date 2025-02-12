/* THIS IS THE MAIN FILE FOR SINGLE NOTE TEST */

import {initiateGame} from "./game.js";
import setupAllSideElements from "./side_elements.js";

window.onload = function() {

  initiateGame('single notes');
  setupAllSideElements();
}
