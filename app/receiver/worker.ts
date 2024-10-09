let array: Blob[] = []; // Use BlobPart type for array to hold Blob parts

self.addEventListener("message", (event: MessageEvent) => {
  if (event.data === "download") {
    const blob = new Blob(array); // Create a Blob from the array
    self.postMessage(blob); // Send the Blob back to the main thread
    array = []; // Reset the array after sending
  } else {
    array.push(event.data); // Add incoming data to the array
  }
});
