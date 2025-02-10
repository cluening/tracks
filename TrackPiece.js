class TrackPiece {
  type;
  angle;
  images;
  imageorigin = Object();
  connections = [];
  activeconnection = -1;

  constructor(type, cursor) {
    this.type = type;
    this.angle = cursor.angle;
    this.images = partslibrary[type].images;
 
    // What this needs to do
    // - Calculate where the connection points are based on rotation
    // - Calculate where to draw the image based on connection point[0] and rotation
    // - Provide some hint about where the cursor moves to and its new angle.  Maybe a function that takes a cursor and returns the corresponding connection's peer?

    // Build a list of connection points for this piece at its location and angle
    // Do the first one first to set an offset baseline
    let baseconn = this.rotateConnection(partslibrary[type].connections[0], cursor.angle);

    for (const conn of partslibrary[type].connections) {
      //console.log("Connection: " + conn.x);
      let newconn = this.rotateConnection(conn, cursor.angle);
      // Shift the point to be relative to the 0th connection being at the cursor
      newconn.x = (newconn.x - baseconn.x) + cursor.x;
      newconn.y = (newconn.y - baseconn.y) + cursor.y;

      this.connections.push(newconn);
    }

    // Find the top-left corner of the image for drawing onto the canvas
    this.imageorigin.x = cursor.x - baseconn.x;  // FIXME: Ha!  Not done.
    this.imageorigin.y = cursor.y - baseconn.y;

    // Update which connection should have something added next
    this.activeconnection = this.connections[0].peer;
    
  }
 
  get cursor() {
    return({
      x: this.connections[this.activeconnection].x,
      y: this.connections[this.activeconnection].y,
      angle: this.angle + this.connections[this.activeconnection].angle
    });
  }

  draw(ctx) {
    let x = this.imageorigin.x;
    let y = this.imageorigin.y;
    let image = this.images[this.angle.toString()];
    ctx.drawImage(image, x, y);
  }

  //--- privateish stuff below

  // Find connection location within a rotated image
  rotateConnection(conn, angle) {
    let point = [conn.x, conn.y];
    let baseimage = this.images["0"];
    let image = this.images[angle.toString()];
  
    let center = [baseimage.width / 2, baseimage.height / 2];
    let pointprime = this.rotatePointAbout(point, angle, center);
    let deltax = image.width - baseimage.width;
    let deltay = image.height - baseimage.height;
  
    pointprime[0] += deltax / 2;
    pointprime[1] += deltay / 2;
  
    pointprime[0] = Math.round(pointprime[0]);
    pointprime[1] = Math.round(pointprime[1]);
  
    return({ x: pointprime[0], y: pointprime[1], angle: conn.angle, peer: conn.peer });
  }

  rotatePoint(point, angle) {
    let theta = angle * Math.PI / 180;
  
    let pointprime = [
      (point[0] * Math.cos(theta)) - (point[1] * Math.sin(theta)),
      (point[0] * Math.sin(theta)) + (point[1] * Math.cos(theta))
    ];
  
    return(pointprime);
  }

  rotatePointAbout(point, angle, about) {
    let newpoint = [
      point[0] - about[0],
      point[1] - about[1]
    ];
  
    let pointprime = this.rotatePoint(newpoint, angle);
  
    pointprime[0] += about[0];
    pointprime[1] += about[1];
  
    return(pointprime);
  }
}
