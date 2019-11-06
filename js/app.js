/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
let matchedCards = []
let cardPair = []
let totalMoves = 0
let clockOff = true
let currentTime = 0
let currentRating = 3

// This adds a clicked card to a list of matched cards
function addToMatchedCards(clickedCard) {
  const card_class = $(clickedCard).find('i').attr('class');
  matchedCards.push(card_class);
}

// This removes the last card clicked from the list of matched cards
function removeFromMatchedCards() {
  matchedCards.pop();
}

// This function checkes if the number of matched cards is equal to the number of
// card pairs. If this is true, it signifies a win and turns off the clock,
// updates the modal message, updates the modal stats and displays the modal.
function confirmWin() {
  if (matchedCards.length === 8) {
    clockOff = true
    updateMessage()
    updateStats()
    toggleModal()
  }
}

// updates the modal message to show "Congratulations!"
function updateMessage() {
  $('.modal_message').text('Congratulations!')
}

// Updates the modal stats with the current rating, time and total moves
function updateStats() {
  const h = Math.floor(currentTime / 3600);
  const m = Math.floor((currentTime % 3600) / 60)
  const s = currentTime - (h*3600) - (m*60)
  $('.modal_time').text('Time = ' + checkTime(h) + ':' + checkTime(m) + ':' + checkTime(s))
  $('.modal_stars').text('Stars =' + currentRating)
  $('.modal_moves').text('Moves = ' + totalMoves)
}

// This calculates and sets the current rating of the game
function setRating() {
  if (totalMoves === 0) {
    currentRating = 3;
  } else {
    wrongMoves = totalMoves - matchedCards.length
    currentRating = 3 - Math.round(wrongMoves*0.05)
  }
  if (currentRating < 1) {
    currentRating = 1
  }

  starsHtml = ""
  for (i = 0; i < currentRating; i++) {
    starsHtml += '<li><i class="fa fa-star"></i></li>'
  }
  $(".stars").empty().append(starsHtml)
}

// This function increments the total number of moves by one
function incrementMoves() {
  totalMoves += 1;
}

// This function updates the  number of moves displayed on the deck
function setMoves() {
  $(".moves").text(totalMoves)
}

// This function shuffles the cards, and it uses the shuffle function defined above
function shuffleCards() {
  allCardClass = []
  $('.deck').find('i').each(function(index) {
    allCardClass.push($(this).attr('class'))
  })

  shuffledCardClass = shuffle(allCardClass)
  $('.deck').find('i').each(function(index) {
    $(this).attr('class', shuffledCardClass[index])
  })

}

// This function flips all cards to show the back o the cards
function flipAllCards() {
  $('.deck').find('li').each(function(index) {
    $(this).attr('class', 'card')
  })
}

// This functio resets the game
function resetGame() {
  matchedCards = []
  cardPair = []
  totalMoves = 0
  currentTime = 0
  clockOff = true
  //debugger;
  setRating()
  setMoves()
  shuffleCards()
  flipAllCards()
}

// This function checks a value is less than 10, then pads with a leading zerio,
// this makes the display of the time in hh:mm:ss
function checkTime(t) {
  if (t<10) {
    t = '0' + t
  } else {
    t = t
  }
  return t
}

// This function runs the clock on the game
function runClock() {
  var h = Math.floor(currentTime / 3600);
  var m = Math.floor((currentTime % 3600) / 60)
  var s = currentTime - (h*3600) - (m*60)
  $('.clock').text(checkTime(h) + ':' + checkTime(m) + ':' + checkTime(s))
  setTimeout(runClock, 1000)
  if (clockOff === false) {
    currentTime += 1
  }
}

function toggleModal() {
  $('.modal_background').toggleClass('hide')
}

function closeModal() {
  toggleModal()
}

function replayGame() {
  clockOff = true
  toggleModal()
  resetGame()
}

// This function controls how the cards are diplayed during the game
function showCard(evt) {
  clockOff = false
  if ($(evt.target).attr('class') === "deck") {
    //debugger;
    // do nothing
    return
  } else {
    // set the target to the parent card if the child icon is clicked
    if ($(evt.target).is('i')) {
      var evt = $(evt.target).parent()
    } else {
      var evt = $(evt.target)
    }
    // if an already opened card is clicked return
    if ($(evt).attr('class') === 'card open show') {
      // do nothing and return
      return
    }
    //debugger;
    if (matchedCards.includes($(evt).find('i').attr('class'))) {
      // do nothing
    } else {
      if (cardPair.length === 0) {
        $(evt).attr('class', 'card open show')
        cardPair.push(evt)
        //debugger;
      } else {
        incrementMoves()
        setMoves()
        if (($(cardPair[0]).find('i').attr('class') === $(evt).find('i').attr('class')) && ($(evt).attr('class') != 'card open show')) {
          addToMatchedCards(evt);
          $(cardPair[0]).attr('class', 'card match');
          $(evt).attr('class', 'card match');
          cardPair.pop();
          //debugger;
        } else {
          //debugger;
          // show second card temporarily
          setTimeout(function() {$(evt).attr('class', 'card open show'); }, 200)
          // flip both cards since they don't match
          setTimeout(function() {
            $(cardPair[0]).attr('class', 'card');
            $(evt).attr('class', 'card');
            cardPair.pop();
          }, 500)
        }
      }
    }
    setRating()
    if (matchedCards.length === 8) {
      confirmWin()
    }
  }
}

toggleModal()
updateStats()
shuffleCards()
runClock()
$('ul.deck').find('li').click('li', showCard)
$('.restart').click('div', resetGame)
$('.modal_cancel').click(toggleModal)
$('.modal_replay').click(replayGame)
