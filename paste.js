// copy paste script
document.querySelector('#paste').addEventListener('click', () => {
    navigator.clipboard.readText()
      .then(text => {
        document.querySelector('#item').value = text;
        ChromeSamples.log('Text pasted.');
      })
      .catch(() => {
        ChromeSamples.log('Failed to read from clipboard.');
      });
  });