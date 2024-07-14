class SimpleGLStack {

    constructor() {
        this.elems = [];
    }

    size() {
        return this.elems.length;
    }

    push(elem) {
        if (elem) {
            this.elems.push(elem);
        } else {
            console.warn("Attempting to push an invalid element onto the stack");
        }
    }

    pop() {
        if (this.elems.length > 0) {
            return this.elems.pop();
        } else {
            console.warn("Attempting to pop from an empty stack");
            return null;
        }
    }

    top() {
        if (this.elems.length > 0) {
            return this.elems[this.elems.length - 1];
        } else {
            console.warn("Attempting to access the top element of an empty stack");
            return null;
        }
    }
}
