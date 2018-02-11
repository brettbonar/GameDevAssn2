let previousTime = performance.now();
let events = [];
let renderEvents = [];

function addEvent() {
  events.push({
    name: document.getElementById("name").value,
    interval: parseInt(document.getElementById("interval").value, 10),
    times: parseInt(document.getElementById("times").value, 10),
    elapsedTime: 0
  });
}

function update(elapsedTime) {
  // Iterate in reverse so we can delete items in place
  for (let i = events.length - 1; i >= 0; --i) {
    let event = events[i];
    event.elapsedTime += elapsedTime;
    if (event.elapsedTime >= event.interval) {
      event.times -= 1;
      event.elapsedTime = 0;
      renderEvents.push(event);

      if (event.times <= 0) {
        events.splice(i, 1);
      }
    }
  };
}

function render(elapsedTime) {
  let eventsListElement = document.getElementById("events-list");
  renderEvents.forEach(function (event) {
    let li = document.createElement("li");
    li.innerHTML = "Event: " + event.name + " (" + event.times + " remaining)";
    eventsListElement.appendChild(li);
  });
  if (renderEvents.length > 0) {
    let eventsElement = document.getElementById("events-container");
    eventsElement.scrollTop = eventsElement.scrollHeight;
  }
  renderEvents = [];
}

function gameLoop(currentTime) {
	let elapsedTime = currentTime - previousTime;
  previousTime = currentTime;

	update(elapsedTime);
	render(elapsedTime);

	requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
