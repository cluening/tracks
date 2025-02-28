class TrackPiece {
  type = "none";
  geometry = "none";
  location = Object();
  angle = 0;
  ports = [];
  startportnum = -1;

  constructor(type, geometry, cursor) {
    this.type = type;
    this.geometry = geometry;
    this.location.x = cursor.x;
    this.location.y = cursor.y;
    this.angle = cursor.angle;
    this.startportnum = partslibrary[this.type].geometry[this.geometry].startportnum;

    // Find the absolute locations of all of this part's ports based on the geometry being used
    for (const portnum in partslibrary[this.type].geometry[this.geometry].ports) {
      const port = partslibrary[this.type].geometry[this.geometry].ports[portnum];
      const newport = Object();
      const newportprime = Object();

      // First find this port's location relative to the geometry's start port
      newport.x = port.x - partslibrary[this.type].geometry[this.geometry].ports[this.startportnum].x;
      newport.y = port.y - partslibrary[this.type].geometry[this.geometry].ports[this.startportnum].y;

      // Next, rotate it around the start port (which is at 0,0 at this point) by this piece's angle
      let theta = this.angle * Math.PI / 180;
      newportprime.x = (newport.x * Math.cos(theta)) - (newport.y * Math.sin(theta));
      newportprime.y = (newport.x * Math.sin(theta)) + (newport.y * Math.cos(theta));

      newport.x = newportprime.x;
      newport.y = newportprime.y;

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


  // Connect a new piece to this piece's active port
  connectPiece(portnum, newpiece, newpieceportnum) {
    this.ports[portnum].connectedpiece = newpiece;
    newpiece.ports[newpieceportnum].connectedpiece = this;
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

  getPortAt(x, y) {
    // console.log("Getting port at "  + x + "," + y);
    const precision = 0.000001;

    for (const portnum in this.ports){
      if (
        (Math.abs(this.ports[portnum].x - x) <= precision) && 
        (Math.abs(this.ports[portnum].y - y) <= precision)
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
