let partslibrary = Object();
const tracklist = new TrackList();
const partslist = [];
let cursor = new Cursor();

function onClick(event) {
  cursor = cursor.handleClick(event.offsetX, event.offsetY);
  window.requestAnimationFrame(drawCanvas);
}

function onKeyDown(event) {
  // console.log(event.code);
  let modifier;

  // Prevent the window from scrolling on arrow presses
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
    event.preventDefault();
  }

  // Record any modifier keys being held.  I'm only going to care about one modifier at a time.
  if (event.altKey) {
    modifier = "Alt";
  } else if (event.ctrlKey) {
    modifier = "Control";
  } else if (event.metaKey) {
    modifier = "Meta";
  } else if (event.shiftKey) {
    modifier = "Shift";
  }
  cursor = cursor.handleKeyPress(event.code, modifier);

  window.requestAnimationFrame(drawCanvas);
}


async function onLoad() {
  const canvas = document.getElementById("layout");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  console.log("Loading!");

  window.addEventListener("keydown", onKeyDown);
  canvas.addEventListener("click", onClick);

  partslibrary = await loadPartsLibrary();
  //console.log(partslibrary);

  cursor.x = 100;
  cursor.y = 100;
  cursor.angle = 0;

  // console.log("-------- Adding new straight piece --------");
  // let newpiece = new TrackPiece("straight", "straight", cursor);
  // console.log("Location:");
  // console.log(newpiece.location);
  // console.log("Angle:");
  // console.log(newpiece.angle);
  // console.log("Ports:");
  // console.log(newpiece.ports);
  // console.log("Active port:");
  // console.log(newpiece.activeport);
  // console.log("Cursor:");
  // console.log(newpiece.cursor);
  // cursor = newpiece.cursor;
  // newpiece.drawPorts(ctx);

  // console.log("-------- Adding new left curved piece --------");
  // newpiece = new TrackPiece("curve", "left", cursor);
  // console.log("Location:");
  // console.log(newpiece.location);
  // console.log("Angle:");
  // console.log(newpiece.angle);
  // console.log("Ports:");
  // console.log(newpiece.ports);
  // console.log("Active port:");
  // console.log(newpiece.activeport);
  // console.log("Cursor:");
  // console.log(newpiece.cursor);
  // cursor = newpiece.cursor;
  // newpiece.drawPorts(ctx);

  // console.log("-------- Adding new right curved piece --------");
  // newpiece = new TrackPiece("curve", "right", cursor);
  // console.log("Location:");
  // console.log(newpiece.location);
  // console.log("Angle:");
  // console.log(newpiece.angle);
  // console.log("Ports:");
  // console.log(newpiece.ports);
  // console.log("Active port:");
  // console.log(newpiece.activeport);
  // console.log("Cursor:");
  // console.log(newpiece.cursor);
  // cursor = newpiece.cursor;
  // newpiece.drawPorts(ctx);

  // console.log("-------- Adding new left switch piece --------");
  // newpiece = new TrackPiece("leftpoint", "rightjoin", cursor);
  // console.log("Location:");
  // console.log(newpiece.location);
  // console.log("Angle:");
  // console.log(newpiece.angle);
  // console.log("Ports:");
  // console.log(newpiece.ports);
  // console.log("Active port:");
  // console.log(newpiece.activeport);
  // console.log("Cursor:");
  // console.log(newpiece.cursor);
  // cursor = newpiece.cursor;
  // newpiece.drawPorts(ctx);


  // cursor = tracklist.add(new TrackPiece("2865", "straight", cursor));
  // cursor = tracklist.add(new TrackPiece("2865", "straight", cursor));
  // cursor = tracklist.add(new TrackPiece("32087", "crossing", cursor));
  // cursor = tracklist.add(new TrackPiece("2865", "straight", cursor));
  // cursor = tracklist.add(new TrackPiece("2865", "straight", cursor));
  // cursor = tracklist.add(new TrackPiece("2867", "right", cursor));
  // cursor = tracklist.add(new TrackPiece("2867", "right", cursor));
  // cursor = tracklist.add(new TrackPiece("2867", "right", cursor));
  // cursor = tracklist.add(new TrackPiece("2867", "right", cursor));
  // cursor = tracklist.add(new TrackPiece("2867", "left", cursor));

  // tracklist.draw(ctx);
  // cursor.draw(ctx);
  window.requestAnimationFrame(drawCanvas);
}


async function loadImages(imagepaths) {
  const promises = Object();
  const images = Object();

  for (const angle in imagepaths) {
    let url = imagepaths[angle];
    //console.log("Loading: " + angle);
    promises[angle] = new Promise((resolve, reject) => {
      const image = new Image();
      image.src = url;
      image.onload = () => resolve(image);
      image.onerror = () => reject("Failed to load image from " + url);
    });
  }

  for (const angle in imagepaths) {
    images[angle] = await promises[angle];
  }

  return(images);
}


async function loadImage(imagepath) {
  //const promise = Object();
  //const image = Object();

  let url = imagepath;
  //console.log("Loading: " + angle);
  const promise = new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.onload = () => resolve(image);
    image.onerror = () => reject("Failed to load image from " + url);
  });

  const image = await promise;

  return(image);
}


async function loadPartsLibrary() {
  const url = "partslibrary/parts.json";
  let partslibrary;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    partslibrary = await response.json();
    //console.log(partslibrary);

    for (const partname in partslibrary) {
      //console.log("Partname: " + partname);
      //partslibrary[partname]["images"] = await loadImages(partslibrary[partname].imagepaths);
      for (const angle in partslibrary[partname].images) {
        partslibrary[partname].images[angle].image = await loadImage("partslibrary/" + partslibrary[partname].images[angle].path)
      }
    }

  } catch (error) {
    console.error(error.message);
  }

  return(partslibrary);
}


function drawCanvas(time) {
  const canvas = document.getElementById("layout");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  tracklist.draw(ctx);
  cursor.draw(ctx);
}
