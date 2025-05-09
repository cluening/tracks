class Cursor {
  x = 0;
  y = 0;
  angle = 0;
  activepiece = undefined;
  activeportnum = undefined;
  activemodifierkeys = new Set();


  draw(ctx) {
    let color = "blue";

    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle * Math.PI / 180);
    ctx.translate(this.x * -1, this.y * -1);

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.fillRect(
      Math.round(this.x - 2),
      Math.round(this.y - 9),
      5, 19
    );
    ctx.stroke();

    ctx.restore();
  }


  handleButtonClick(part, geometry) {
    let newcursor = this;

    newcursor = layout.add(new TrackPiece(part, geometry, this));

    return newcursor;
  }


  handleCanvasClick(x, y) {
    const newcursor = new Cursor();

    const [targetpiece, targetportnum] = layout.getPieceAt(x, y);

    if (targetpiece != undefined) {
      newcursor.x = targetpiece.ports[targetportnum].x;
      newcursor.y = targetpiece.ports[targetportnum].y;
      newcursor.angle = targetpiece.ports[targetportnum].angle;
      newcursor.activepiece = targetpiece;
      newcursor.activeportnum = targetportnum;
    } else {
      newcursor.x = x;
      newcursor.y = y;
      newcursor.angle = 0;
      newcursor.activepiece = undefined;
      newcursor.activeportnum = undefined;
    }

    return newcursor;
  }


  handleCanvasDoubleClick(x, y) {
    const newcursor = this;
    const [targetpiece, targetportnum] = layout.getPieceAt(x, y);

    if (targetpiece != undefined) {
      targetpiece.selected = true;
    }

    return this;
  }


  handleKeyPress(code, modifier) {
    let newcursor = this;

    // First handle arrows and the like
    switch(code) {
      case "ArrowLeft":
        this.moveAlongTrack("left");
        break;
      case "ArrowRight":
        this.moveAlongTrack("right");
        break;
      case "ArrowDown":
        this.moveAlongTrack("down");
        break;
      case "ArrowUp":
        this.moveAlongTrack("up");
        break;
      case "Backspace":
        newcursor = layout.remove(cursor.activepiece);
        break;
    }

    // Next, handle keypressess associated with parts library pieces
    if (partskeytable[code] != undefined) {
      if (partskeytable[code][modifier] != undefined) {
        newcursor = layout.add(new TrackPiece(partskeytable[code][modifier].part, partskeytable[code][modifier].geometry, this));
      }
    }

    return newcursor;
  }

  moveAlongTrack(direction) {
    // console.log("Trying out moving: " + direction);

    if (this.activepiece == undefined) {
      // There's no piece to start moving along!
      return;
    }

    let portdirections;
    const options = [];

    // console.log("Potential places to move:");

    // There are two potential places to move:
    //  - The peer of the port that the cursor is currently on
    //  - The peer of the port that's connected to the port the cursor is currently on

    // Find possible directions for this port's peer, which should always exist
    // const activeport = this.activepiece.ports[this.activepiece.activeport]
    const activeport = this.activepiece.ports[this.activeportnum];
    portdirections = this.directionToPort(this.activepiece.ports[activeport.peer]);

    options[0] = {
      piece: this.activepiece,
      port: activeport.peer,
      xdirection: portdirections.xdirection,
      ydirection: portdirections.ydirection
    };

    // If there's a port on another piece connected to this one, find that port's peer
    // console.log("The connected port's peer:")
    if (activeport.connectedpiece != undefined) {
      let connectedportnum = activeport.connectedpiece.getPortAt(this.x, this.y);
      let connectedportpeer = activeport.connectedpiece.ports[connectedportnum].peer;

      // console.log(activeport.connectedpiece);

      portdirections = this.directionToPort(activeport.connectedpiece.ports[connectedportpeer]);

      options[1] = {
        piece: activeport.connectedpiece,
        port: activeport.connectedpiece.ports[connectedportnum].peer,
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
      this.activeportnum = options[0].port;
    } else if (options[1].xdirection == direction || options[1].ydirection == direction) {
      // console.log("Move to options[1]");
      this.x = options[1].piece.ports[options[1].port].x;
      this.y = options[1].piece.ports[options[1].port].y;
      this.angle = options[1].piece.ports[options[1].port].angle;
      this.activepiece = options[1].piece
      this.activeportnum = options[1].port
    } else {
      // console.log("Nowhere to move");
    }
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
