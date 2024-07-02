import { options } from "../sharedState.js";

/**
 * Class representing a cluster of pixels.
 */
class ChunkCluster {
    /**
     * Create a ChunkCluster.
     * @param {Array} data - The data for the chunk cluster.
     */
    constructor(data) {
        /**
         * @property {number} size - The size of the chunk.
         */
        this.size = options.chunkSize;
        /**
         * @property {Array} data - The data for the chunk cluster.
         */
        this.data = data;
        /**
         * @property {boolean} protected - Whether the chunk is protected.
         */
        this.protected = false;
        /**
         * @property {boolean} squaring - Whether to use squaring optimization.
         */
        this.squaring = options.squaring;
        /**
         * @property {HTMLCanvasElement} canvas - The canvas element for rendering.
         */
        this.canvas = document.createElement("canvas");
        this.canvas.width = options.chunkSize;
        this.canvas.height = options.chunkSize;
        /**
         * @property {CanvasRenderingContext2D} ctx - The 2D rendering context for the canvas.
         */
        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
        /**
         * @property {boolean} needsRedraw - Whether the chunk needs to be redrawn.
         */
        this.needsRedraw = true;
    }

    /**
     * Draw the chunk cluster on the canvas.
     */
    draw() {
        if(!this.needsRedraw) return;

        if (this.squaring) {
            const visited = Array.from({ length: this.size }, () => Array(this.size).fill(false));

            for (let x = 0; x < this.size; x++) {
                for (let y = 0; y < this.size; y++) {
                    if (!visited[x][y]) {
                        const color = this.data[x][y];
                        let width = 1, height = 1;

                        // Determine width of the rectangle
                        while (x + width < this.size && this.data[x + width][y] === color) {
                            width++;
                        }

                        // Determine height of the rectangle
                        outer: for (let w = 0; w < width; w++) {
                            for (let h = 1; h < this.size - y; h++) {
                                if (this.data[x + w][y + h] !== color) {
                                    break outer;
                                }
                            }
                            height++;
                        }

                        this.ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
                        this.ctx.fillRect(x, y, width, height);

                        // Mark these pixels as visited
                        for (let w = 0; w < width; w++) {
                            for (let h = 0; h < height; h++) {
                                visited[x + w][y + h] = true;
                            }
                        }
                    }
                }
            }
        } else {
            for (let x = 0; x < this.size; x++) {
                for (let y = 0; y < this.size; y++) {
                    this.ctx.fillStyle = this.data[x][y];
                    this.ctx.fillRect(x, y, 1, 1);
                }
            }
        }

        this.needsRedraw = false;
    }

    /**
     * Update a specific pixel in the chunk cluster.
     * @param {number} x - The x coordinate of the pixel.
     * @param {number} y - The y coordinate of the pixel.
     * @param {Array} color - The color of the pixel.
     */
    setPixel(x, y, color) {
        this.data[x][y] = color;
        this.ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        this.ctx.fillRect(x, y, 1, 1);
    }

    /**
     * Get the canvas element.
     * @returns {HTMLCanvasElement} The canvas element.
     */
    getCanvas() {
        if (this.needsRedraw) this.draw();
        return this.canvas;
    }
}

export default ChunkCluster;