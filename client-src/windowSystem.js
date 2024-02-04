export const windows = {};

function addDragAbility(windowInstance) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const dragMouseDown = (e) => {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    const elementDrag = (e) => {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        windowInstance.frame.style.top = (windowInstance.frame.offsetTop - pos2) + "px";
        windowInstance.frame.style.left = (windowInstance.frame.offsetLeft - pos1) + "px";
    }

    const closeDragElement = () => {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }

    windowInstance.titleBar.onmousedown = dragMouseDown;
}

export class GUIWindow {
    constructor(title, options, contentCallback) {
        this.title = title;
        this.options = options;
        this.contentCallback = contentCallback;
        this.initialize();
        windows[title] = this;
    }
    initialize() {
        this.frame = document.createElement('div');
        this.titleBar = document.createElement('div');
        this.closeButton = document.createElement('button');
        this.titleLabel = document.createElement('span');
        this.container = document.createElement('div');

        this.frame.appendChild(this.titleBar);
        this.titleBar.appendChild(this.closeButton);
        this.titleBar.appendChild(this.titleLabel);
        this.frame.appendChild(this.container);

        this.frame.className = 'window-frame';
        this.titleBar.className = 'window-titlebar';
        this.closeButton.className = 'window-close-button';
        this.titleLabel.className = 'window-title-label';
        this.container.className = 'window-container';

        this.titleLabel.textContent = this.title;
        this.closeButton.innerHTML = '&times;';
        this.closeButton.onclick = () => this.close();

        if (this.options.centered) {
            this.frame.style.position = 'fixed';
            this.frame.style.top = '50%';
            this.frame.style.left = '50%';
            this.frame.style.transform = 'translate(-50%, -50%)';
        }

        if (this.options.background) {
            this.frame.style.background = this.options.background.frame;
            this.titleBar.style.background = this.options.background.titleBar;
            this.container.style.background = this.options.background.container;
        }

        document.body.appendChild(this.frame);
        this.contentCallback(this);

        addDragAbility(this);
    }
    addObj(htmlElement) {
        this.container.appendChild(htmlElement);
        return htmlElement;
    }
    close() {
        document.body.removeChild(this.frame);
        delete windows[this.title];
    }
    move(x, y) {
        this.frame.style.position = 'absolute';
        this.frame.style.left = `${x}px`;
        this.frame.style.top = `${y}px`;
    }
    setTitle(newTitle) {
        this.title = newTitle;
        this.titleLabel.textContent = newTitle;
    }
    setSize(width, height) {
        this.frame.style.width = `${width}px`;
        this.frame.style.height = `${height}px`;
    }
}

/*
Example usage:

new GUIWindow('My Window Title', {}, (windowInstance) => {
    const content = document.createElement('p');
    content.textContent = 'This is a dynamic content inside the window.';

    windowInstance.addObj(content);
}).move(200, 200);
*/