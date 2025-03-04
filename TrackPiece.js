class TrackPiece {
  type = "none";
  geometry = "none";
  location = Object();
  angle = 0;
  ports = [];
  startportnum = -1;
  image;
  imagebaseangle;

  constructor(type, geometry, cursor) {
    this.type = type;
    this.geometry = geometry;
    this.location.x = cursor.x;
    this.location.y = cursor.y;
    this.angle = cursor.angle;
    this.startportnum = partslibrary[this.type].geometry[this.geometry].startportnum;
    this.image = partslibrary[type].images[(this.angle % 90).toString()];

    // Get the angles of the zeroth port and start port for this piece at its
    // current angle
    let baseimage = partslibrary[type].images[(this.angle % 90).toString()];
    let imagezeroportangle = baseimage.ports[0].angle;
    let imagestartportangle = baseimage.ports[this.startportnum].angle;

    // Calculate the angle of the image that should be used for this piece,
    // and then set this piece's image to that one
    let imageangle = ((imagezeroportangle - imagestartportangle + this.angle) + 360) % 90;
    this.image = partslibrary[type].images[imageangle];

    // Calculate the angle that the image should be drawn at.  This is always
    // a multiple of 90
    let imagegeometryangle = ((imagezeroportangle - imagestartportangle + this.angle) + 360) % 360
    this.imagebaseangle = Math.trunc(imagegeometryangle / 90) * 90;

    // Find the absolute locations of all of this part's ports based on the geometry being used
    for (const portnum in partslibrary[this.type].geometry[this.geometry].ports) {
      const port = partslibrary[this.type].geometry[this.geometry].ports[portnum];
      const newport = new TrackPort();
      const newportprime = new TrackPort();

      // First find this port's location relative to the geometry's start port
      newport.x = port.x - partslibrary[this.type].geometry[this.geometry].ports[this.startportnum].x;
      newport.y = port.y - partslibrary[this.type].geometry[this.geometry].ports[this.startportnum].y;

      // Next, rotate it around the start port (which is at 0,0 at this point) by this piece's angle
      let theta = this.angle * Math.PI / 180;
      newportprime.x = (newport.x * Math.cos(theta)) - (newport.y * Math.sin(theta));
      newportprime.y = (newport.x * Math.sin(theta)) + (newport.y * Math.cos(theta));

      newport.x = newportprime.x;
      newport.y = newportprime.y;

      // Scale the port's location by the image scaling factor
      newport.x = newport.x * 2;
      newport.y = newport.y * 2;

      // Finally, move it relative to the start port's location
      newport.x += this.location.x;
      newport.y += this.location.y;

      // Find the angle of this port: rotate the start port to 0 degrees, then
      // add back in this port's rotation offset, then add in this piece's angle
      newport.angle = partslibrary[this.type].geometry[this.geometry].ports[0].angle 
          - partslibrary[this.type].geometry[this.geometry].ports[this.startportnum].angle
          + port.angle + this.angle;
      newport.angle = newport.angle % 360;

      // Record this port's peer
      newport.peer = port.peer;

      this.ports.push(newport);
    }
  }


  // Disconnect this piece from another piece
  disconnectPort(portnum) {
    const x = this.ports[portnum].x;
    const y = this.ports[portnum].y;
    // console.log("Disconnecting piece " + this.ports[portnum].connectedpiece);

    // Find and disconnect the port on the other piece
    const otherportnum = this.ports[portnum].connectedpiece.getPortAt(x, y);
    // console.log("Disconnecting other port " + otherportnum);
    this.ports[portnum].connectedpiece.ports[otherportnum].connectedpiece = undefined;

    // Disconnect the port on this piece
    this.ports[portnum].connectedpiece = undefined;
  }


  // FIXME: should this be called "connectPort"?
  // Connect a new piece to the given port on this piece
  connectPiece(portnum, newpiece, newpieceportnum) {
    this.ports[portnum].connectedpiece = newpiece;
    newpiece.ports[newpieceportnum].connectedpiece = this;
  }


  // Draw this piece in its correct spot
  draw(ctx) {
    let x = this.location.x;
    let y = this.location.y;

    //let baseangle = Math.trunc(this.angle / 90) * 90;
    //let baseangle = Math.trunc(this.imagegeometryangle / 90) * 90;

    ctx.save();

    // Since rotate() rotates around grid lines and pixels are draw into grid squares, rotating
    // a pixel at 0,0 180 degrees around 0,0 effectively puts that pixel at -1,-1.  These lines shift the
    // location as needed to compensate for that.
    if (this.imagebaseangle == 90) { x += 1; }
    if (this.imagebaseangle == 180) { x += 1; y += 1; }
    if (this.imagebaseangle == 270) { y += 1; }

    // Compensation done!  Time to rotate around this part's origin port
    ctx.translate(Math.round(x), Math.round(y));
    ctx.rotate(this.imagebaseangle * Math.PI / 180);
    ctx.translate(Math.round(x) * -1, Math.round(y) * -1);

    ctx.drawImage(
      this.image.image,
      Math.round(x - this.image.ports[this.startportnum].x),
      Math.round(y - this.image.ports[this.startportnum].y)
    );

    ctx.restore();
  }


  drawPorts(ctx) {
    let colors = ["blue", "red", "cornflowerblue", "orange"];

    for (const port in this.ports) {
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(this.ports[port].x, this.ports[port].y);
      ctx.lineTo(this.ports[this.ports[port].peer].x, this.ports[this.ports[port].peer].y)
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = colors[port];
      ctx.fillStyle = colors[port];
      ctx.fillRect(
        Math.round(this.ports[port].x - 2),
        Math.round(this.ports[port].y - 2),
        5, 5
      );
      ctx.stroke();
    }
  }


  // Return this piece's port at x,y within a tolerance of tolerance pixels, if it exists
  getPortAt(x, y, tolerance=0.5) {
    // console.log("Getting port at "  + x + "," + y);
    //const tolerance = 5;  // pixels (or base geometry studs)

    for (const portnum in this.ports){
      if (
        (Math.abs(this.ports[portnum].x - x) <= tolerance) && 
        (Math.abs(this.ports[portnum].y - y) <= tolerance)
      ) {
        // console.log("Found a port! " + portnum);
        return portnum;
      }

      // if ((this.ports[portnum].x == x) && (this.ports[portnum].y == y)) {
      //   // console.log("Found a port! " + portnum);
      //   return portnum;
      // }
    }

    // If we get here, no port was found
    // console.log("No port found");
    return undefined;
  }

}
