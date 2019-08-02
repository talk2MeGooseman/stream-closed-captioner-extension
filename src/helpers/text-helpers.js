/* eslint-disable import/prefer-default-export */
import uuid from "uuid/v4";


/**
 * Add text to the final text queue
 *
 * @export
 * @param {Array} finalTextQueue
 * @param {string} finalText
 * @returns
 */
export function updateFinalTextQueue(finalTextQueue, finalText) {
  let newQueue = finalTextQueue;
  const lastText = finalTextQueue[finalTextQueue.length - 1] || {};

  if (lastText.text !== finalText) {
    newQueue = [...finalTextQueue, { id: uuid(), text: finalText }];
  }
  return newQueue;
}

/**
 * Limit the size of the text Queue
 *
 * @param {Array} finalTextQueue
 */
export function limitQueueSize(textQueue) {
  if (textQueue.length > 20) {
    textQueue.shift();
  }
}
