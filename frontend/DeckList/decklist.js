async function loadDeck() {
  const deckText = document.getElementById('deckInput').value;

  // Parse meta tags (Name, Commander, About)
  let name = '', commander = '', about = '', deckLines = [];
  const lines = deckText.split('\n');

  let parsingDeck = false;
  for (const line of lines) {
    const trimmed = line.trim();

    if (/^Name:/i.test(trimmed)) {
      name = trimmed.replace(/^Name:\s*/i, '');
    } else if (/^Commander:/i.test(trimmed)) {
      commander = trimmed.replace(/^Commander:\s*/i, '');
    } else if (/^About:/i.test(trimmed)) {
      about = trimmed.replace(/^About:\s*/i, '');
    } else if (/^Deck:/i.test(trimmed)) {
      parsingDeck = true;
    } else if (parsingDeck && trimmed.length > 0) {
      deckLines.push(trimmed);
    }
  }

  // Parse card lines into structured objects
  const parsedCards = deckLines
    .map(line => {
      const quantityMatch = line.match(/^\s*(\d+)x?\s+/);
      const foil = /\*F\*/.test(line);
      const quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : 1;

      const cleaned = line
        .replace(/^\s*\d+x?\s+/, '')
        .replace(/\s+\(.*?\)\s+\d+\s*(\*F\*)?$/, '');

      return {
        name: cleaned.trim(),
        quantity,
        foil
      };
    })
    .filter(card => card.name.length > 0);

  const deckArea = document.getElementById('deckArea');
  deckArea.innerHTML = '';

  // Header display
  if (name || commander || about) {
    const meta = document.createElement('div');
    meta.style.textAlign = 'left';
    meta.style.margin = '1em auto';
    meta.style.maxWidth = '600px';
    meta.innerHTML = `
      ${name ? `<h2>${name}</h2>` : ''}
      ${commander ? `<p><strong>Commander:</strong> ${commander}</p>` : ''}
      ${about ? `<p><strong>About:</strong> ${about}</p>` : ''}
      <hr>
    `;
    deckArea.appendChild(meta);
  }

  if (!parsedCards.length) {
    deckArea.textCo
