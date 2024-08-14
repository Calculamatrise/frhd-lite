import Powerup from "../powerup.js";

export default class extends Powerup {
	hit = !1;
	id = crypto.randomUUID();
}