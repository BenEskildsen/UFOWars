"use strict";

var queueAdd = function queueAdd(queue, item, maxLength) {
  queue.push(item);
  if (queue.length > maxLength) {
    queue.shift();
  }
};

module.exports = { queueAdd: queueAdd };