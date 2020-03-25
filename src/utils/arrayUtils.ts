/*eslint no-extend-native: ["error", { "exceptions": ["Array"] }]*/

// This file needs to be a module
// https://github.com/Microsoft/TypeScript/issues/17736#issuecomment-323073256
export {};

/// Array<T>.shuffle()
declare global {
  interface Array<T> {
    shuffled(): Array<T>;
  }
}

if (!Array.prototype.shuffled) {
  Array.prototype.shuffled = function<T>(): Array<T> {
    let counter = this.length;

    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      const index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      const temp = this[counter];
      this[counter] = this[index];
      this[index] = temp;
    }

    return this;
  };
}
