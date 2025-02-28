class TrackList {
  tracklist = [];

  // Add a new piece of track
  add(newpiece) {
    // If the cursor is on a piece, connect the new piece to it
    if (cursor.activepiece != undefined) {
      // cursor.activepiece.connectPiece(newpiece, cursor.activeportnum);
      cursor.activepiece.connectPiece(cursor.activeportnum, newpiece, newpiece.startport);  // FIXME: 0 needs to be the start port
    }

    // If the new piece's other end lines up with an already-existing piece,
    // connect the new piece to it
    for (const piece of this.tracklist) {
      const x = newpiece.ports[newpiece.ports[newpiece.startport].peer].x;
      const y = newpiece.ports[newpiece.ports[newpiece.startport].peer].y;
      const portnum = piece.getPortAt(x, y);
      if (portnum != undefined) {
        console.log("Found a port to connect to!");
        newpiece.connectPiece(newpiece.ports[newpiece.startport].peer, piece, portnum);  // FIXME: 1 needs to be the other port on the current piece
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

  // Draw the whole track list into the given context
  draw(ctx) {
    for (let piece of this.tracklist){
      // piece.draw(ctx);
      piece.drawPorts(ctx);
    }
  }
}
