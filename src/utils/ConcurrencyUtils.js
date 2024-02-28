function withTimeout(promise, timeout) {
  return new Promise((resolve, reject) => {
    // Set a timer that rejects the promise when time is up
    const timer = setTimeout(() => {
      reject(new Error("Operation timed out"));
    }, timeout);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

export async function limitConcurrency(tasks, limit, timeout) {
  let active = [];
  const results = [];

  for (const task of tasks) {
    const promise = withTimeout(task(), timeout)
      .then((result) => {
        // Remove the promise from the active array when it resolves or rejects
        active = active.filter((p) => p !== promise);
        return result;
      })
      .catch((error) => {
        // Handle timeout or other errors
        console.error(error, task);
        active = active.filter((p) => p !== promise);
        // Depending on your use case, you might want to throw the error,
        // return a specific value, or simply log the error.
        return null; // Example: return null for timeouts/errors
      });

    results.push(promise);
    active.push(promise);

    // If the limit is reached, wait for one of the promises to complete
    if (active.length >= limit) {
      await Promise.race(active);
    }
  }

  // Wait for all remaining promises to complete
  return Promise.all(results);
}

/*
// Example usage
const tasks = urls.map((url, index) => {
  return () =>
    getSemrushWebTraffic(url, exportColumns, displayDate, countries[index]);
});

limitConcurrency(tasks, 5, 10000) // Limit to 5 concurrent tasks with a 10-second timeout
  .then((results) => {
    // Process results, including handling nulls for timeouts or errors
  });

  // Example usage
const tasks = urls.map((url, index) => {
    return () => getSemrushWebTraffic(url, exportColumns, displayDate, countries[index]);
});

limitConcurrency(tasks, 5, 10000) // Limit to 5 concurrent tasks with a 10-second timeout
    .then(results => {
        // Process results, including handling nulls for timeouts or errors
    });
*/
