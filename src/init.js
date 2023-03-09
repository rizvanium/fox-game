import initButtons from "./buttons";
import { TICK_RATE } from "./constants";
import gameState, { handleUserAction } from "./gameState";

async function init() {
  console.log("starting game");
  initButtons(handleUserAction);
  let nextTimeToTick = Date.now();

  const nextAnimationFrame = () => {
    const now = Date.now();
    if (nextTimeToTick <= now) {
      gameState.tick();
      nextTimeToTick = now + TICK_RATE;
    }
    requestAnimationFrame(nextAnimationFrame);
  };

  requestAnimationFrame(nextAnimationFrame);
}

init();
