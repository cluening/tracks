class TrackPiece {
  type = "none";
  geometry = "none";
  location = Object();
  angle = 0;
  ports = [];
  startport = -1;
  activeport = -1;

  constructor(type, geometry, cursor) {
    this.type = type;
    this.geometry = geometry;
    this.location.x = cursor.x;
    this.location.y = cursor.y;
    this.angle = cursor.angle;
    this.startport = partslibrary[this.type].geometry[this.geometry].startport;

    // Find the absolute locations of all of this part's ports based on the geometry being used
    for (const portnum in partslibrary[this.type].geometry[this.geometry].ports) {
      const port = partslibrary[this.type].geometry[this.geometry].ports[portnum];
      const newport = Object();
      const newportprime = Object();

      // First find this port's location relative to the geometry's start port
      newport.x = port.x - partslibrary[this.type].geometry[this.geometry].ports[this.startport].x;
      newport.y = port.y - partslibrary[this.type].geometry[this.geometry].ports[this.startport].y;

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
      // add back in this port's rotation offset
      newport.angle = partslibrary[this.type].geometry[this.geometry].ports[0].angle 
          - partslibrary[this.type].geometry[this.geometry].ports[this.startport].angle
          + port.angle;
      newport.angle = newport.angle % 360;

      // Record this port's peer
      newport.peer = port.peer;

      // If the port is the default one attach it to the previous piece that the cursor was on.
      if (portnum == this.startport) {
        newport.connectedto = cursor.activepiece;  // FIXME: I should probably change "connectedto" to "connectedpiece" to make it more clear
      } else {
        newport.connectedto = undefined;
      }

      // Also connect the previous piece to this one
      if (newport.connectedto != undefined) {
        newport.connectedto.ports[newport.connectedto.activeport].connectedto = this;
      }

      this.ports.push(newport);
    }

    // Update which connection port should have something added next
    this.activeport = partslibrary[this.type].geometry[this.geometry].ports[this.startport].peer;
  }

  get cursor() {
    const newcursor = new Cursor();

    newcursor.x = this.ports[this.activeport].x;
    newcursor.y = this.ports[this.activeport].y;
    newcursor.angle = (this.angle + this.ports[this.activeport].angle) % 360;
    newcursor.activepiece = this;

    return newcursor;
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

    for (const portnum in this.ports){
      if ((this.ports[portnum].x == x) && (this.ports[portnum].y == y)) {
        // console.log("Found a port! " + portnum);
        return portnum;
      }
    }

    // If we get here, no port was found
    return undefined;
  }

}
