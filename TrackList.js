class TrackList {
  tracklist = [];
  changed = false;

  // Add a new piece of track
  add(newpiece, connect=true) {
    this.changed = true;

    // If the cursor's active port is already connected to something, do nothing
    if (
      cursor.activepiece != undefined 
      && cursor.activepiece.ports[cursor.activeportnum].connectedpiece != undefined
    ) {
      return cursor;
    }

    // Connect the new piece to the other pieces it should be connected to
    if (connect == true) {
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
            if (otherportnum != undefined && piece.ports[otherportnum].connectedpiece == undefined) {
              // if (otherportnum != undefined) {
              newpiece.connectPiece(portnum, piece, otherportnum);
            }
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
    newcursor.activemodifierkeys = cursor.activemodifierkeys;

    return(newcursor);
  }


  remove(rmpiece) {
    if (rmpiece == undefined) {
      // There's nothing to delete!
      return cursor;
    }

    this.changed = true;

    // Prepare a new cursor to return at the end
    const newcursor = new Cursor();
    const activeportpeernum = rmpiece.ports[cursor.activeportnum].peer;

    newcursor.x = rmpiece.ports[activeportpeernum].x
    newcursor.y = rmpiece.ports[activeportpeernum].y
    newcursor.activemodifierkeys = cursor.activemodifierkeys;

    // If this port's peer is connected to another piece, make that piece active
    // Otherwise, leave the cursor floating at the peer port's location
    if (rmpiece.ports[activeportpeernum].connectedpiece != undefined) {
      newcursor.activepiece = rmpiece.ports[activeportpeernum].connectedpiece;
      newcursor.activeportnum = newcursor.activepiece.getPortAt(newcursor.x, newcursor.y);
      newcursor.angle = newcursor.activepiece.ports[newcursor.activeportnum].angle;
    } else {
      newcursor.activepiece = undefined;
      newcursor.activeportnum = undefined;
      newcursor.angle = (rmpiece.ports[activeportpeernum].angle + 180) % 360;
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


  // Return a piece and port near x, y, if one exists
  getPieceAt(x, y) {
    // Search in reverse order to priorize pieces on top of other pieces
    for (let i = this.tracklist.length - 1; i >= 0; i--) {
      const piece = this.tracklist[i];

      if (piece.isAt(x, y)) {
        const portnum = piece.getClosestPort(x, y);
        return [ piece, portnum ];
      }
    }

    return [ undefined, undefined ];
  }


  // Draw the whole track list into the given context
  draw(ctx) {
    for (let piece of this.tracklist){
      piece.draw(ctx);
      // piece.drawPorts(ctx);
      // piece.drawBounds(ctx);
    }
  }


  // Create a JSON blob that can be downloaded
  createExportBlob() {
    const layoutexport = Object();

    layoutexport.version = 0;
    layoutexport.piecelist = []

    for (const i in this.tracklist) {
      const currentpiece = Object();
      currentpiece.type = this.tracklist[i].type;
      currentpiece.geometry = this.tracklist[i].geometry;
      currentpiece.location = Object();
      currentpiece.location.x = this.tracklist[i].location.x;
      currentpiece.location.y = this.tracklist[i].location.y;
      currentpiece.angle = this.tracklist[i].angle;
      currentpiece.ports = [];
      for (const port of this.tracklist[i].ports) {
        const currentport = Object();
        currentport.connectedpiece = this.tracklist.indexOf(port.connectedpiece);
        currentpiece.ports.push(currentport);
      }

      layoutexport.piecelist.push(currentpiece);
    }

    return new Blob([JSON.stringify(layoutexport)], { type: "text/json" });
  }

}
