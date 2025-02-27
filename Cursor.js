class Cursor {
  x = 0;
  y = 0;
  angle = 0;
  activepiece = undefined;

  draw(ctx) {
    let color = "black";

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.fillRect(
      Math.round(this.x - 1),
      Math.round(this.y - 5),
      3, 11
    );
    ctx.stroke();
  }

  handleKeyPress(code) {
    switch(code) {
      case "ArrowLeft":
        // console.log("Cursor moving left");
        this.moveAlongTrack("left");
        break;
      case "ArrowRight":
        // console.log("Cursor moving right");
        this.moveAlongTrack("right");
        break;
      case "ArrowDown":
        // console.log("Cursor moving down");
        this.moveAlongTrack("down");
        break;
      case "ArrowUp":
        // console.log("Cursor moving up");
        this.moveAlongTrack("up");
        break;
    }
  }

  moveAlongTrack(direction) {
    // console.log("Trying out moving: " + direction);

    let portdirections;
    const options = [];

    // console.log("Potential places to move:");

    // There are two potential places to move:
    //  - The peer of the port that the cursor is currently on
    //  - The peer of the port that's connected to the port the cursor is currently on

    // Find this port's peer, which should always exist
    // console.log("This port's peer:");
    const activeport = this.activepiece.ports[this.activepiece.activeport]

    portdirections = this.directionToPort(this.activepiece.ports[activeport.peer]);
    // console.log(portdirections);

    options[0] = {
      piece: this.activepiece,
      port: activeport.peer,
      xdirection: portdirections.xdirection,
      ydirection: portdirections.ydirection
    };

    // If there's a port on another piece connected to this one, find that port's peer
    // console.log("The connected port's peer:")
    if (activeport.connectedto != undefined) {
      let connectedportnum = activeport.connectedto.getPortAt(this.x, this.y); // FIXME: maybe I should have a "connectedpiece" and a "connectedport" so I don't need to go through this effort, which is potentially not going to work reliably with floating point numbers
      let connectedportpeer = activeport.connectedto.ports[connectedportnum].peer;

      // console.log(activeport.connectedto);

      portdirections = this.directionToPort(activeport.connectedto.ports[connectedportpeer]);

      options[1] = {
        piece: activeport.connectedto,
        port: activeport.connectedto.ports[connectedportnum].peer,
        xdirection: portdirections.xdirection,
        ydirection: portdirections.ydirection
      };
    } else {
      // console.log("Nothing!");
      options[1] = {
        piece: undefined,
        port: undefined,
        xdirection: undefined,
        ydirection: undefined
      };
    }

    // console.log(options);

    // We know where each port is.  Let's see where we should move.
    if (
        (options[0].xdirection == direction && options[1].xdirection == direction) ||
        (options[0].ydirection == direction && options[1].ydirection == direction)
      ) {
      // console.log("Both ports are " + directon + ".  Do nothing.");
    } else if (options[0].xdirection == direction || options[0].ydirection == direction) {
      // console.log("Move to options[0]");
      this.x = options[0].piece.ports[options[0].port].x;
      this.y = options[0].piece.ports[options[0].port].y;
      this.angle = options[0].piece.ports[options[0].port].angle;
      this.activepiece = options[0].piece
      this.activepiece.activeport = options[0].port;
    } else if (options[1].xdirection == direction || options[1].ydirection == direction) {
      // console.log("Move to options[1]");
      this.x = options[1].piece.ports[options[1].port].x;
      this.y = options[1].piece.ports[options[1].port].y;
      this.angle = options[1].piece.ports[options[1].port].angle;
      this.activepiece = options[1].piece
      this.activepiece.activeport = options[1].port;
    } else {
      // console.log("Nowhere to move");
    }

    window.requestAnimationFrame(drawCanvas);
  }

  directionToPort(port){
    let xdirection;
    let ydirection;

    // console.log("Finding directions to:");
    // console.log(port);

    if (port.x < this.x) {
      xdirection = "left";
    } else if (port.x > this.x) {
      xdirection = "right";
    } else {
      xdirection = undefined;
    }

    if (port.y < this.y) {
      ydirection = "up";
    } else if (port.y > this.y) {
      ydirection = "down";
    } else {
      ydirection = undefined;
    }

    return { xdirection: xdirection, ydirection: ydirection };
  }

}
