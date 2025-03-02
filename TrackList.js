class TrackList {
  tracklist = [];

  // Add a new piece of track
  // FIXME: this needs to do nothing if the active port is already connected to something
  add(newpiece) {
    // If the cursor's active port is already connected to something, do nothing
    if (
      cursor.activepiece != undefined 
      && cursor.activepiece.ports[cursor.activeportnum].connectedpiece != undefined
    ) {
      return cursor;
    }

    // Connect the new piece to the other pieces it should be connected to
    for (const portnum in newpiece.ports) {
      if ((portnum == newpiece.startportnum) && (cursor.activepiece != undefined)) {
        // The startport should connect to the cursor's currently active piece
        cursor.activepiece.connectPiece(cursor.activeportnum, newpiece, newpiece.startportnum);
      } else {
        // Other ports should connect to existing pieces with overlapping ports
        for (const piece of this.tracklist) {
          const x = newpiece.ports[portnum].x;
          const y = newpiece.ports[portnum].y;
          const otherportnum = piece.getPortAt(x, y);
          if (otherportnum != undefined) {
            newpiece.connectPiece(portnum, piece, otherportnum);
          }
        }
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
    if (rmpiece == undefined) {
      // There's nothing to delete!
      return cursor;
    }

    // Prepare a new cursor to return at the end
    // FIXME: this should actually find the port that the cursor is on and use the peer of that port
    const newcursor = new Cursor();
    newcursor.activepiece = undefined;
    newcursor.activeportnum = undefined;
    newcursor.x = rmpiece.ports[rmpiece.startportnum].x;
    newcursor.y = rmpiece.ports[rmpiece.startportnum].y;
    newcursor.angle = (rmpiece.ports[rmpiece.startportnum].angle + 180) % 360;

    // Look for a connected piece to move the cursor to
    // If there's not one, the defaults above will be returned
    // FIXME: maybe this should only update the cursor if it's the current port's peer; otherwise, the cursor can jump in a weird direction with crossing pieces
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
      // console.log("Disconnecting port " + portnum);
      if (rmpiece.ports[portnum].connectedpiece != undefined) {
        // console.log("Port " + portnum + " is connected to something");
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
