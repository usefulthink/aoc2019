module.exports = function iostream(debugCallback = () => {}) {
  /**
   * @type {number[]}
   */
  let dataQueue = [];

  /**
   * @type {Array<{resolve: function, reject: function}>}
   */
  let promiseQueue = [];

  /**
   * @type {boolean}
   */
  let running = true;

  return {
    /**
     * Stops the generator and returns the remaining items in the data-queue.
     * @returns {number[]}
     */
    end() {
      running = false;

      return dataQueue;
    },

    /**
     * Writes a value to the stream to be consumed.
     * @param value
     */
    push(value) {
      debugCallback('push', {value});
      // writing: when there is a consumer waiting (items in the promiseQueue),
      // resolve the oldest promise directly, otherwise push rto dataQueue
      if (promiseQueue.length > 0) {
        promiseQueue.shift().resolve(value);
      } else {
        dataQueue.push(value);
      }
    },

    /**
     * A generator for values that will even work when values didn't arrive yet
     * when it's called.
     * @returns {AsyncIterableIterator<unknown>}
     */
    async *outputStream() {
      // reading: always read from data-queue as long as it is available, if no
      // data is waiting, create a new promise in the promiseQueue
      while (running) {
        if (dataQueue.length > 0) {
          const value = dataQueue.shift();
          debugCallback('read', {value});

          yield value;
        } else {
          debugCallback('read queued', {});
          const value = await new Promise((resolve, reject) =>
            promiseQueue.push({resolve, reject})
          );
          debugCallback('read resolved', {value});

          yield value;
        }
      }
    }
  };
};
