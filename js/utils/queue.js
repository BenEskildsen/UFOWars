// @flow

const queueAdd = <T>(queue: Array<T>, item: T, maxLength: number): void => {
  queue.push(item);
  if (queue.length > maxLength) {
    queue.shift();
  }
}

module.exports = {queueAdd};