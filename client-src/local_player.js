import events from "./events";
import { mouse } from "./mouse";

class Bucket {
    constructor(rate, time, infinite) {
        this.lastCheck = Date.now();
        this.allowance = rate;
		this.rate = rate;
        this.time = time;
		this.infinite = infinite || false;
	}
	update() {
		this.allowance += (Date.now() - this.lastCheck) / 1000 * (this.rate / this.time);
		this.lastCheck = Date.now();

		if (this.allowance > this.rate) {
			this.allowance = this.rate;
		}
	}
	canSpend(count) {
		if (this.infinite) {
			return true;
		}

		this.update();

		if (this.allowance < count) {
			return false;
		}

		this.allowance -= count;

		return true;
	}
	getTimeToRestore() {
		if (this.allowance >= this.rate) return 0;
        return (this.rate - this.allowance) / (this.rate / this.time);
	}
	async waitUntilRestore() {
        const restoreTime = this.getTimeToRestore() * 1000;
        await new Promise(resolve => setTimeout(resolve, restoreTime));
	}
}

const local_player = {
    selectedColor: [0, 0, 0],
    palette: [[0, 0, 0]],
    nickname: localStorage.nickname || null,
    rank: 0,
    pixelQuota: new Bucket(100, 2),
    tool: 0,
	id: null,
	_text: '',
	get text() {
		return this._text;
	},
	set text(value) {
		this._text = value;
		document.getElementById("text-input").innerText = this._text;
	}
}

window.addEventListener('keypress', event => {
    if (event.key.length === 1) local_player.text += event.key;
})

window.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
		events.emit("addText", local_player.text, `${mouse.tileX},${mouse.tileY}`);
        local_player.text = '';
	} else if (event.key === 'Backspace') {
		local_player.text = local_player.text.slice(0, -1);
	}
})

export default local_player;