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

module.exports = Bucket;