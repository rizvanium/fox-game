import { modFox, modScene } from "./ui";
import {
  DAY_LENGTH,
  NIGHT_LENGTH,
  RAIN_CHANCE,
  SCENES,
  getNextHungerTime,
  getNextDeathTime,
  getNextPoopTime,
} from "./constants";

const gameState = {
  current: "INIT",
  wakeTime: -1,
  sleepTime: -1,
  hungryTime: -1,
  deathTime: -1,
  timeToStartCelebrating: -1,
  timeToEndCelebrating: -1,
  clock: 1,

  tick() {
    this.clock++;
    console.log("tick", this.clock);

    if (this.clock === this.wakeTime) {
      this.wake();
    } else if (this.clock === this.sleepTime) {
      this.sleep();
    } else if (this.clock === this.hungryTime) {
      this.getHungry();
    } else if (this.clock === this.deathTime) {
      this.die();
    } else if (this.clock === this.timeToStartCelebrating) {
      this.startCelebrating();
    } else if (this.clock === this.timeToEndCelebrating) {
      this.endCelebrating();
    }

    return this.clock;
  },
  startGame() {
    this.current = "HATCHING";
    this.wakeTime = this.clock + 3;
    modFox("egg");
    modScene("day");
  },
  wake() {
    this.current = "IDLING";
    this.wakeTime = -1;
    this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
    this.sleepTime = this.clock + DAY_LENGTH;
    this.hungryTime = getNextHungerTime(this.clock);
    modFox(this.determineFoxIdleState());
    modScene(SCENES[this.scene]);
  },
  sleep() {
    this.current = "SLEEP";
    modFox("sleep");
    modScene("night");
    this.wakeTime = this.clock + NIGHT_LENGTH;
  },
  changeWeather() {
    console.log("weather changed");
  },
  cleanPoop() {
    console.log("poop cleaned");
  },
  getHungry() {
    this.current = "HUNGRY";
    this.deathTime = getNextDeathTime(this.clock);
    this.hungryTime = -1;
    modFox("hungry");
  },
  feed() {
    if (this.current !== "HUNGRY") {
      return;
    }

    this.current = "FEEDING";
    this.deathTime = -1;
    this.pooptime = getNextPoopTime();
    this.timeToStartCelebrating = this.clock + 2;
    modFox("eating");
  },
  die() {
    modFox("dead");
  },
  startCelebrating() {
    this.current = "CELEBRATING";
    modFox("celebrate");
    this.timeToStartCelebrating = -1;
    this.timeToEndCelebrating = this.clock + 2;
  },
  endCelebrating() {
    this.current = "CELEBRATING";
    this.current = "IDLING";
    this.timeToEndCelebrating = -1;
    modFox(this.determineFoxIdleState());
  },
  determineFoxIdleState() {
    return SCENES[this.scene] === "day" ? "idling" : "rain";
  },
  handleUserAction(icon) {
    if (
      ["SLEEP", "FEEDING", "CELEBRATING", "HATCHING"].includes(this.current)
    ) {
      return;
    }

    if (this.current === "INIT" || this.current === "DEAD") {
      this.startGame();
      return;
    }

    switch (icon) {
      case "weather":
        this.changeWeather();
        break;
      case "poop":
        this.cleanPoop();
        break;
      case "fish":
        this.feed();
        break;
    }
  },
};

export const handleUserAction = gameState.handleUserAction.bind(gameState);
export default gameState;
