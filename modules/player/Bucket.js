/**
 * Represents a rate limiter that allows actions up to a certain rate and then restricts further actions until enough time has passed.
 */
class Bucket {
    /**
     * Creates an instance of Bucket.
     * @param {number} rate The maximum number of actions allowed per time period.
     * @param {number} time The time period in seconds for the rate limit.
     * @param {boolean} [infinite=false] Whether the bucket has an infinite allowance.
     */
    constructor(rate, time, infinite) {
        /** @type {number} The timestamp of the last check for rate limiting. */
        this.lastCheck = Date.now();
        /** @type {number} The current allowance of actions within the time period. */
        this.allowance = rate;
        /** @type {number} The maximum number of actions allowed per time period. */
		this.rate = rate;
        /** @type {number} The time period in seconds for the rate limit. */
        this.time = time;
        /** @type {boolean} Whether the bucket has an infinite allowance. */
		this.infinite = infinite || false;
	}

    /**
     * Updates the current allowance based on the time elapsed since the last check.
     */
	update() {
		this.allowance += (Date.now() - this.lastCheck) / 1000 * (this.rate / this.time);
		this.lastCheck = Date.now();

		if (this.allowance > this.rate) {
			this.allowance = this.rate;
		}
	}

    /**
     * Determines if a specified number of actions can be spent without exceeding the rate limit.
     * @param {number} count The number of actions to spend.
     * @returns {boolean} True if the actions can be spent, false otherwise.
     */
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

    /**
     * Calculates the time required to restore the bucket's allowance to its maximum rate.
     * @returns {number} The time in seconds until the allowance is fully restored.
     */
	getTimeToRestore() {
		if (this.allowance >= this.rate) return 0;
        return (this.rate - this.allowance) / (this.rate / this.time);
	}

    /**
     * Waits asynchronously until the bucket's allowance is fully restored.
     */
	async waitUntilRestore() {
        const restoreTime = this.getTimeToRestore() * 1000;
        await new Promise(resolve => setTimeout(resolve, restoreTime));
	}
}

module.exports = Bucket;