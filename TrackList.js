class TrackList {
  tracklist = [];

  // Add a new piece of track
  add(newpiece) {
    this.tracklist.push(newpiece);

    // Connect the new piece to the one that the cursor is currently on
    console.log("Connecting new piece to existing piece");
    if (cursor.activepiece != undefined) {
      cursor.activepiece.connectPiece(newpiece, cursor.activeportnum);
    }

    // Prepare a new cursor object to return
    const newcursor = new Cursor();
    const newpieceportnum = newpiece.getPortAt(cursor.x, cursor.y);
    newcursor.activepiece = newpiece;
    newcursor.activeportnum = newcursor.activepiece.ports[newpieceportnum].peer;
    newcursor.x = newcursor.activepiece.ports[newcursor.activeportnum].x;
    newcursor.y = newcursor.activepiece.ports[newcursor.activeportnum].y;
    newcursor.angle = (newcursor.activepiece.angle + newcursor.activepiece.ports[newcursor.activeportnum].angle) % 360;

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
