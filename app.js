const form = document.getElementById('cardForm');
const cardList = document.getElementById('cardList');
const scanBtn = document.getElementById('scanBtn');
const scannerBox = document.getElementById('scanner');

let cards = JSON.parse(localStorage.getItem('cards') || '[]');

function renderCards() {
  cardList.innerHTML = '';
  cards.forEach((card, index) => {
    const div = document.createElement('div');
    div.className = 'card';

    // barcode SVG
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    JsBarcode(svg, card.cardNumber, { format: "CODE128", displayValue: true, width:2, height:50 });
    div.appendChild(svg);

    // názov obchodu
    const h3 = document.createElement('h3');
    h3.textContent = card.shopName;
    div.appendChild(h3);

    // číslo karty
    const pNumber = document.createElement('p');
    pNumber.textContent = `Číslo: ${card.cardNumber}`;
    div.appendChild(pNumber);

    // poznámky
    if(card.notes){
      const pNotes = document.createElement('p');
      pNotes.textContent = `Poznámky: ${card.notes}`;
      div.appendChild(pNotes);
    }

    // tlačidlo odstrániť
    const btn = document.createElement('button');
    btn.textContent = 'Odstrániť';
    btn.onclick = () => deleteCard(index);
    div.appendChild(btn);

    cardList.appendChild(div);
  });
}

function deleteCard(index) {
  cards.splice(index, 1);
  localStorage.setItem('cards', JSON.stringify(cards));
  renderCards();
}

// pridanie karty ručne
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const shopName = document.getElementById('shopName').value;
  const cardNumber = document.getElementById('cardNumber').value;
  const notes = document.getElementById('notes').value;

  cards.push({ shopName, cardNumber, notes });
  localStorage.setItem('cards', JSON.stringify(cards));
  renderCards();
  form.reset();
});

// skener čiarových kódov
scanBtn.addEventListener('click', () => {
  scannerBox.style.display = 'block';

  Quagga.init({
    inputStream : {
      name : "Live",
      type : "LiveStream",
      target: scannerBox,
      constraints: {
        facingMode: "environment"
      }
    },
    decoder : {
      readers: ["ean_reader", "ean_8_reader", "code_128_reader", "code_39_reader"]
    }
  }, function(err) {
      if (err) { console.log(err); return; }
      Quagga.start();
  });

  Quagga.onDetected(data => {
    const code = data.codeResult.code;
    document.getElementById('cardNumber').value = code;
    Quagga.stop();
    scannerBox.style.display = 'none';
  });
});

renderCards();



