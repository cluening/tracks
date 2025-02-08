let crossing = Object();
crossing.url = "graphics/crossing/";
crossing.images = Object();
crossing.conn = [];
crossing.conn[0] = { x: 0, y: 16, angle: 180, peer: 1 };
crossing.conn[1] = { x: 32, y: 16, angle: 0, peer: 0 };

let straight = Object();
straight.url = "graphics/straight/";
straight.images = Object();
straight.conn = [];
straight.conn[0] = { x: 0, y: 8, angle: 180, peer: 1 };
straight.conn[1] = { x: 32, y: 8, angle: 0, peer: 0 };

let rightcurve = Object();
rightcurve.url = "graphics/curve/";
rightcurve.images = Object();
rightcurve.conn = [];
rightcurve.conn[0] = { x: 0, y: 8, angle: 180, peer: 1 };
rightcurve.conn[1] = { x: 31, y: 14, angle: 22.5, peer: 0 };

async function onLoad() {
  const canvas = document.getElementById("td");
  const ctx = canvas.getContext("2d");
  const image = document.getElementById("track");

  console.log("Loading!");

  const urls = [
    'graphics/crossing/0.png',
    'graphics/straight/0.png',
  ];

  //[crossing.image, straight.image, rightcurve.image] = await preloadImages([crossing.url, straight.url + "0.png", rightcurve.url]);

  [rightcurve.images["0"], rightcurve.images["22.5"]] = await preloadImages([rightcurve.url + "0.png", rightcurve.url + "22-5.png"]);

  [crossing.images["0"], crossing.images["22.5"]] = await preloadImages([crossing.url + "0.png", crossing.url + "22-5.png"]);

  [straight.images["0"], straight.images["22.5"]] = await preloadImages([straight.url + "0.png", straight.url + "22-5.png"]);

  let cursor = {
    x: 10,
    y: 20,
    angle: 0
  };

  // Draw the crossing at the start position
  // FIXME: should this take a connection number too?  Or should it always assume 0?
  // FIXME: Always assuming 0 would probably require giving the cursor an orientation too.
  cursor = drawTrack(crossing, cursor);

  // Connect conn[0] on the straight to conn[1] on the crossing
  cursor = drawTrack(straight, cursor);
  cursor = drawTrack(rightcurve, cursor);
  cursor = drawTrack(straight, cursor);
  cursor = drawTrack(straight, cursor);
  cursor = drawTrack(crossing, cursor);
  cursor = drawTrack(straight, cursor);
  cursor = drawTrack(rightcurve, cursor);

  //console.log(rotatePoint(-16, 0, -22.5));
  // Try rotating the first straight connection point
  //console.log(rotatePointAbout(0, 8,   16, 8,   22.5));
  // Try rotating the bottom-left corner of the straight track
  //console.log(rotatePointAbout(0, 16,   16, 8,   22.5));
  // Try rotating the top-left corner of the straight track
  //console.log(rotatePointAbout(0, 0,   16, 8,   22.5));

  console.log("straight: " + rotatePointInImage([0, 8], 22.5, straight.images["0"]));
  console.log("straight no rotation: " + rotatePointInImage([0, 8], 0, straight.images["0"]));
  console.log("crossing: " + rotatePointInImage([0, 16], 22.5, crossing.images["0"]));
  console.log("straight conn: " + getConnection(straight, 0, 22.5));
  console.log("crossing conn: " + getConnection(crossing, 0, 22.5));
}


function getConnection(track, connnumber, angle) {
  let point = [track.conn[connnumber].x, track.conn[connnumber].y];
  let baseimage = track.images["0"];
  let image = track.images[angle.toString()];

  let about = [baseimage.width / 2, baseimage.height / 2];
  let pointprime = rotatePointAbout(point, angle, about);
  let deltax = image.width - baseimage.width;
  let deltay = image.height - baseimage.height;

  pointprime[0] += deltax / 2;
  pointprime[1] += deltay / 2;

  pointprime[0] = Math.round(pointprime[0]);
  pointprime[1] = Math.round(pointprime[1]);

  return(pointprime);
}


function rotatePointInImage(point, angle, image) {
  let x = point[0];
  let y = point[1];

  console.log("point early: " + point);

  let theta = angle * Math.PI / 180;
  let nw = [0, 0];
  let ne = [image.width, 0];
  let se = [image.width, image.height];
  let sw = [0, image.height];
  let aboutx = image.width / 2;
  let abouty = image.height / 2;
  let about = [image.width / 2, image.height / 2];

// TODO: find the new bounding box first, and then do the rotation about its center?

  let nwprime = rotatePointAbout(nw, angle, about);
  let neprime = rotatePointAbout(ne, angle, about);
  let seprime = rotatePointAbout(se, angle, about);
  let swprime = rotatePointAbout(sw, angle, about);

  console.log("nwprime: " + nwprime);

  let topleft = [
    Math.min(...[nwprime[0], neprime[0], seprime[0], swprime[0]]),
    Math.min(...[nwprime[1], neprime[1], seprime[1], swprime[1]])
  ];

  let bottomright = [
    Math.max(...[nwprime[0], neprime[0], seprime[0], swprime[0]]),
    Math.max(...[nwprime[1], neprime[1], seprime[1], swprime[1]])
  ];

  let pointprime = rotatePointAbout(point, angle, about);

  console.log("point: " + point);
  console.log("topleft: " + topleft);
  console.log("pointprime: " + pointprime);
  pointprime[0] -= topleft[0];
  pointprime[1] -= topleft[1];  

  pointprime[0] = Math.round(pointprime[0]);
  pointprime[1] = Math.round(pointprime[1]);

  return(pointprime);
}


function rotatePoint(point, angle) {
  let theta = angle * Math.PI / 180;

  let pointprime = [
    (point[0] * Math.cos(theta)) - (point[1] * Math.sin(theta)),
    (point[0] * Math.sin(theta)) + (point[1] * Math.cos(theta))
  ];

  return(pointprime);
}


function rotatePointAbout(point, angle, about) {
  let newpoint = [
    point[0] - about[0],
    point[1] - about[1]
  ];

  let pointprime = rotatePoint(newpoint, angle);

  pointprime[0] += about[0];
  pointprime[1] += about[1];

  return(pointprime);
}


function drawTrack(track, cursor) {
  const canvas = document.getElementById("td");
  const ctx = canvas.getContext("2d");

  const conn = 0;
  const peer = track.conn[conn].peer;

  let newconn = getConnection(track, conn, cursor.angle);
  let x = cursor.x - newconn[0];
  let y = cursor.y - newconn[1];

  ctx.drawImage(track.images[cursor.angle.toString()], x, y);

  // Playing with focus.  Doesn't seem to do anything.
  track.images[cursor.angle.toString()].classList.add("active");
  ctx.drawFocusIfNeeded(track.images[cursor.angle.toString()]);

  newconn = getConnection(track, peer, cursor.angle);

  return({
    x: x + newconn[0],
    y: y + newconn[1],
    angle: cursor.angle + track.conn[peer].angle
  });
}


function olddrawTrack(track, cursor) {
  const canvas = document.getElementById("td");
  const ctx = canvas.getContext("2d");

  const conn = 0;
  const peer = track.conn[conn].peer;

  console.log("angle: " + cursor.angle);
  // Connection point locations are relative to the 0 degree image, so this always rotates that one
  let newconn = rotatePointInImage([track.conn[conn].x, track.conn[conn].y], cursor.angle, track.images["0"]);
  console.log("newconn: " + newconn);
  let x = cursor.x - newconn[0];
  let y = cursor.y - newconn[1];

  //ctx.save();

  //ctx.rotate(20 * Math.PI / 180);
  ctx.drawImage(track.images[cursor.angle.toString()], x, y);

  //ctx.restore();

  newconn = rotatePointInImage([track.conn[peer].x, track.conn[peer].y], cursor.angle, track.images["0"]);

  return({
    x: x + newconn[0],
    y: y + newconn[1],
    angle: cursor.angle + track.conn[peer].angle
  });

//   return({
//     x: x + track.conn[peer].x,
//     y: y + track.conn[peer].y,
//     angle: cursor.angle + track.conn[peer].angle
//   })
}


function preloadImages(urls) {
  const promises = urls.map((url) => {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.src = url;

      image.onload = () => resolve(image);
      image.onerror = () => reject(`Image failed to load: ${url}`);
    });
  });

  return Promise.all(promises);
}
