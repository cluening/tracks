/*
TODO
 - Make a Cursor class
 - Handle image rotations for angles >= 90
*/

let partslibrary = Object();
const tracklist = new TrackList();
const partslist = [];

async function onLoad() {
  const canvas = document.getElementById("td");
  const ctx = canvas.getContext("2d");

  console.log("Loading!");

  partslibrary = await loadPartsLibrary();
  //console.log(partslibrary);

  let cursor = new Cursor();
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


  cursor = tracklist.add(new TrackPiece("straight", "straight", cursor));
  cursor = tracklist.add(new TrackPiece("straight", "straight", cursor));
  cursor = tracklist.add(new TrackPiece("straight", "straight", cursor));
  cursor = tracklist.add(new TrackPiece("straight", "straight", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "right", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "right", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "right", cursor));
  // cursor = tracklist.add(new TrackPiece("curve", "right", cursor));

  // cursor = tracklist.add(new TrackPiece("curve", "left", cursor));
  // cursor = tracklist.add(new TrackPiece("curve", "left", cursor));
  // cursor = tracklist.add(new TrackPiece("curve", "left", cursor));
  // cursor = tracklist.add(new TrackPiece("curve", "left", cursor));

  cursor = tracklist.add(new TrackPiece("straight", "straight", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "left", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "left", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "left", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "left", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "left", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "left", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "left", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "left", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "left", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "left", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "left", cursor));
  cursor = tracklist.add(new TrackPiece("straight", "straight", cursor));
  cursor = tracklist.add(new TrackPiece("straight", "straight", cursor));
  cursor = tracklist.add(new TrackPiece("straight", "straight", cursor));
  cursor = tracklist.add(new TrackPiece("straight", "straight", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "right", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "right", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "right", cursor));
  cursor = tracklist.add(new TrackPiece("straight", "straight", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "left", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "left", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "left", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "left", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "left", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "left", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "left", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "left", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "left", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "left", cursor));
  cursor = tracklist.add(new TrackPiece("curve", "left", cursor));

  // cursor = tracklist.add(new TrackPiece("curve", "right", cursor));
  // cursor = tracklist.add(new TrackPiece("curve", "right", cursor));
  // cursor = tracklist.add(new TrackPiece("curve", "right", cursor));
  // cursor = tracklist.add(new TrackPiece("curve", "right", cursor));
  // cursor = tracklist.add(new TrackPiece("straight", "straight", cursor));
  // cursor = tracklist.add(new TrackPiece("straight", "straight", cursor));
  // cursor = tracklist.add(new TrackPiece("straight", "straight", cursor));
  // cursor = tracklist.add(new TrackPiece("straight", "straight", cursor));
  // cursor = tracklist.add(new TrackPiece("curve", "right", cursor));
  // cursor = tracklist.add(new TrackPiece("curve", "right", cursor));
  // cursor = tracklist.add(new TrackPiece("curve", "right", cursor));
  // cursor = tracklist.add(new TrackPiece("curve", "right", cursor));
  // cursor = tracklist.add(new TrackPiece("curve", "right", cursor));
  // cursor = tracklist.add(new TrackPiece("curve", "right", cursor));
  // cursor = tracklist.add(new TrackPiece("curve", "right", cursor));
  // cursor = tracklist.add(new TrackPiece("curve", "right", cursor));

  // cursor = tracklist.add(new TrackPiece("straight", "straight", cursor));
  // cursor = tracklist.add(new TrackPiece("curve", "right", cursor));
  // cursor = tracklist.add(new TrackPiece("curve", "right", cursor));
  // cursor = tracklist.add(new TrackPiece("crossing", "crossing", cursor));
  // cursor = tracklist.add(new TrackPiece("curve", "right", cursor));
  // cursor = tracklist.add(new TrackPiece("curve", "right", cursor));
  // cursor = tracklist.add(new TrackPiece("straight", "straight", cursor));

  tracklist.draw(ctx);

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
  const url = "partslibrary.json";
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
        partslibrary[partname].images[angle].image = await loadImage(partslibrary[partname].images[angle].path)
      }
    }

  } catch (error) {
    console.error(error.message);
  }

  return(partslibrary);
}
