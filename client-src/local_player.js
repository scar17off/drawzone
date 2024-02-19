import events from "./events.js";
import { mouse } from "./mouse.js";

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
    selectedColor: null,
    palette: [
		[228, 166, 114], [184, 111, 80], [116, 63, 57], [63, 40, 50],
		[158, 40, 53], [229, 59, 68], [251, 146, 43], [255, 231, 98],
		[99, 198, 77], [50, 115, 69], [25, 61, 63], [79, 103, 129],
		[175, 191, 210], [255, 255, 255], [44, 232, 244], [4, 132, 209]
	],
    nickname: localStorage.nickname || null,
    rank: 0,
    pixelQuota: new Bucket(0, 0),
    tool: 0,
	id: null,
	_text: '',
	get text() {
		return this._text;
	},
	set text(value) {
		this._text = value;
		document.getElementById("text-input").innerText = this._text;
	},
	currentFxRenderer: {
		type: 0,
		params: []
	}
}
local_player.selectedColor = local_player.palette[0];

window.addEventListener('keypress', event => {
    if (event.key.length === 1) local_player.text += event.key;
});

window.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
		events.emit("addText", local_player.text, mouse.tileX, mouse.tileY);
        local_player.text = '';
	} else if (event.key === 'Backspace') {
		local_player.text = local_player.text.slice(0, -1);
	}
});

// color stuff
function addColorEvent(item) {
    item.addEventListener('click', () => {
        const color = item.getAttribute('data-color').split(',').map(Number);
        local_player.selectedColor = color;
        document.querySelectorAll('.color-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
    });
	item.addEventListener("contextmenu", event => {
		item.remove();
		local_player.palette = local_player.palette.filter(color => color !== item.getAttribute("data-color").split(',').map(Number));
		event.preventDefault();
	});
}

document.querySelectorAll('.color-item').forEach(item => addColorEvent(item));

export function addColor(color) {
    const colorDiv = document.createElement('div');
    colorDiv.className = 'color-item';
    colorDiv.style.backgroundColor = `rgb(${color.join(',')})`;
    local_player.palette.push(color);
    colorDiv.setAttribute('data-color', color.join(','));
    document.getElementById("color-list").appendChild(colorDiv);
    addColorEvent(colorDiv);
}

document.getElementById('color-picker').addEventListener('change', () => {
    const color = document.getElementById('color-picker').value.match(/\w\w/g).map(hex => parseInt(hex, 16));
    addColor(color);
});

local_player.palette.forEach(color => {
    addColor(color);
});	

export default local_player;