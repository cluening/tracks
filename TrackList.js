class TrackList {
  tracklist = [];

  // Add a new piece of track
  add(track) {
    this.tracklist.push(track);

    // Connect the new piece to the one that the cursor is currently on
    console.log("Connecting new piece to existing piece");
    if (cursor.activepiece != undefined) {
      cursor.activepiece.connectPiece(track);
    }

    return(track.cursor);
  }

  // Draw the whole track list into the given context
  draw(ctx) {
    for (let track of this.tracklist){
      // track.draw(ctx);
      track.drawPorts(ctx);
    }
  }
}
