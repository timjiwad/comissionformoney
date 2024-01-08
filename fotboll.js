// Kontrollera om dokumentet är fortfarande på väg att laddas
if (document.readyState == 'loading') {
  // Lägg till en lyssnare för att vänta på att DOM ska laddas helt
  document.addEventListener('DOMContentLoaded', ready);
} else {
  // Om dokumentet redan har laddats helt, anropa ready direkt
  ready();
}

// Funktion som körs när DOM är helt laddat
function ready() {
  // Hämta alla knappar med klassen 'btn-danger' för att ta bort varor från kundvagnen
  var removeCartItemButtons = document.getElementsByClassName('btn-danger');

  // Lägg till klick-lyssnare för varje 'ta bort'-knapp
  for (var i = 0; i < removeCartItemButtons.length; i++) {
    var button = removeCartItemButtons[i];
    button.addEventListener('click', removeCartItem);
  }

  // Hämta alla inmatningsfält för kvantitet
  var quantityInputs = document.getElementsByClassName('cart-quantity-input');

  // Lägg till lyssnare för ändringar i kvantitet för varje inmatningsfält
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener('change', quantityChanged);
  }

  // Hämta alla knappar med klassen 'shop-item-button' för att lägga till i kundvagnen
  var addToCartButtons = document.getElementsByClassName('shop-item-button');

  // Lägg till klick-lyssnare för varje 'lägg till'-knapp
  for (var i = 0; i < addToCartButtons.length; i++) {
    var button = addToCartButtons[i];
    button.addEventListener('click', addToCartClicked);
  }

  // Lägg till klick-lyssnare för köp-knappen
  document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked);
}

// Funktion som körs när användaren klickar på köp-knappen
function purchaseClicked() {
  // Visa en enkel alert med ett tackmeddelande
  alert('Tack för din beställning');

  // Rensa kundvagnen genom att ta bort alla barnnoder
  var cartItems = document.getElementsByClassName('cart-items')[0];
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild);
  }

  // Uppdatera det totala priset i kundvagnen
  updateCartTotal();
}

// Funktion för att ta bort en vara från kundvagnen
function removeCartItem(event) {
  // Hitta knappen som klickades på
  var buttonClicked = event.target;

  // Ta bort hela raden (förälderns förälder)
  buttonClicked.parentElement.parentElement.remove();

  // Uppdatera det totala priset i kundvagnen
  updateCartTotal();
}

// Funktion som körs när kvantiteten ändras
function quantityChanged(event) {
  // Hitta inmatningsfältet som ändrades
  var input = event.target;

  // Kontrollera om värdet inte är ett nummer eller är mindre än eller lika med noll
  if (isNaN(input.value) || input.value <= 0) {
    // Sätt värdet till 1
    input.value = 1;
  }

  // Uppdatera det totala priset i kundvagnen
  updateCartTotal();
}

// Funktion som körs när användaren klickar på 'lägg till'-knappen
function addToCartClicked(event) {
  // Hitta knappen som klickades på
  var button = event.target;

  // Hitta den överordnade produktraden
  var shopItem = button.parentElement.parentElement;

  // Hämta titeln, priset och bildkällan för produkten
  var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
  var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText;
  var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src;

  // Lägg till produkten i kundvagnen
  addItemToCart(title, price, imageSrc);

  // Uppdatera det totala priset i kundvagnen
  updateCartTotal();
}

// Funktion för att lägga till en vara i kundvagnen
function addItemToCart(title, price, imageSrc) {
  // Skapa en ny rad för kundvagnen
  var cartRow = document.createElement('div');
  cartRow.classList.add('cart-row');

  // Hämta kundvagnscontainer
  var cartItems = document.getElementsByClassName('cart-items')[0];

  // Kontrollera om produkten redan finns i kundvagnen
  var cartItemNames = cartItems.getElementsByClassName('cart-item-title');
  for (var i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames[i].innerText == title) {
      // Visa en varning och avbryt om produkten redan finns
      alert('Denna produkt finns redan i kundvagnen');
      return;
    }
  }

  // Skapa innehållet för kundvagnsraden som en sträng
  var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">Ta bort</button>
        </div>`;

  // Sätt innehållet i kundvagnsraden
  cartRow.innerHTML = cartRowContents;

  // Lägg till kundvagnsraden i kundvagnen
  cartItems.append(cartRow);

  // Lägg till klick-lyssnare för knappen 'ta bort'
  cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);

  // Lägg till lyssnare för ändringar i kvantitet
  cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged);
}

// Funktion för att uppdatera det totala priset i kundvagnen
function updateCartTotal() {
  // Hämta kundvagnscontainer
  var cartItemContainer = document.getElementsByClassName('cart-items')[0];

  // Hämta alla kundvagnsraderna
  var cartRows = cartItemContainer.getElementsByClassName('cart-row');

  // Variabel för att hålla det totala priset
  var total = 0;

  // Loopa igenom varje kundvagnsrad
  for (var i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];

    // Hämta pris- och kvantitetsinformation för varje vara
    var priceElement = cartRow.getElementsByClassName('cart-price')[0];
    var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];

    // Extrahera pris och kvantitet som flyttal
    var price = parseFloat(priceElement.innerText.replace(':-', ''));
    var quantity = quantityElement.value;

    // Beräkna det totala priset för varje vara och lägg till i totalen
    total = total + (price * quantity);
  }

  // Avrunda det totala priset till två decimaler
  total = Math.round(total * 100) / 100;

  // Uppdatera det totala priset i HTML-dokumentet
  document.getElementsByClassName('cart-total-price')[0].innerText = total + ':-';
}
