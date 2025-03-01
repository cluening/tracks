class TrackList {
  tracklist = [];

  // Add a new piece of track
  // FIXME: this needs to do nothing if the active port is already connected to something
  add(newpiece) {
    // If the cursor is on a piece, connect the new piece to it
    if (cursor.activepiece != undefined) {
      cursor.activepiece.connectPiece(cursor.activeportnum, newpiece, newpiece.startportnum);
    }

    // If the new piece's other end lines up with an already-existing piece,
    // connect the new piece to it
    for (const piece of this.tracklist) {
      const x = newpiece.ports[newpiece.ports[newpiece.startportnum].peer].x;
      const y = newpiece.ports[newpiece.ports[newpiece.startportnum].peer].y;
      const portnum = piece.getPortAt(x, y);
      if (portnum != undefined) {
        newpiece.connectPiece(newpiece.ports[newpiece.startportnum].peer, piece, portnum);
      }
    }

    // Add the new piece to the track list
    this.tracklist.push(newpiece);

    // Prepare a new cursor object to return
    const newcursor = new Cursor();
    const newpieceportnum = newpiece.getPortAt(cursor.x, cursor.y);
    newcursor.activepiece = newpiece;
    newcursor.activeportnum = newcursor.activepiece.ports[newpieceportnum].peer;
    newcursor.x = newcursor.activepiece.ports[newcursor.activeportnum].x;
    newcursor.y = newcursor.activepiece.ports[newcursor.activeportnum].y;
    newcursor.angle = (newcursor.activepiece.ports[newcursor.activeportnum].angle) % 360;

    return(newcursor);
  }


  remove(rmpiece) {
    // Prepare a new cursor to return at the end
    const newcursor = new Cursor();
    newcursor.activepiece = undefined;
    newcursor.activeportnum = undefined;
    newcursor.x = rmpiece.x;
    newcursor.y = rmpice.y;
    newcursor.angle = 0;

    // Look for a connected piece to move the cursor to
    // If there's not one, the defaults above will be returned
    for (const portnum in rmpiece.ports) {
      if (rmpiece.ports[portnum].connectedpiece != undefined) {
        newcursor.activepiece = rmpiece.ports[portnum].connectedpiece;
        newcursor.activeportnum = newcursor.activepiece.getPortAt(rmpiece.ports[portnum].x, rmpiece.ports[portnum].y);
        newcursor.x = newcursor.activepiece.ports[newcursor.activeportnum].x;
        newcursor.y = newcursor.activepiece.ports[newcursor.activeportnum].y;
        newcursor.angle = newcursor.activepiece.ports[newcursor.activeportnum].angle;
        break;
      }
    }

    // Disconnect this piece's ports
    for (const portnum in rmpiece.ports) {
      console.log("Disconnecting port " + portnum);
      if (rmpiece.ports[portnum].connectedpiece != undefined) {
        console.log("Port " + portnum + " is connected to something");
        rmpiece.disconnectPort(portnum);
      }
    }

    // Find the index of the piece and remove it from the list
    const rmpieceindex = this.tracklist.indexOf(rmpiece);
    this.tracklist.splice(rmpieceindex, 1);

    return newcursor;
  }


  // Draw the whole track list into the given context
  draw(ctx) {
    for (let piece of this.tracklist){
      // piece.draw(ctx);
      piece.drawPorts(ctx);
    }
  }
}
