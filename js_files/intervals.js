/* THIS IS THE MAIN FILE FOR THE INTERVAL TEST */

import {initiateGame} from "./game.js";
import setupAllSideElements from "./side_elements.js";

window.onload = function() {

  initiateGame('intervals');
  setupAllSideElements();
}
