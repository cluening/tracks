class TrackPiece {
  type;
  style;
  angle;
  image = Object();
  location = Object();  // Location of the starting connector for the given type and style
  ports = [];
  imagerotation = 0;
  imagemirror = 1;
  startport = -1;
  activeport = -1;

  constructor(type, style, cursor) {
    this.type = type;
    this.style = style;
    this.angle = cursor.angle;
    this.location.x = cursor.x;
    this.location.y = cursor.y;
    this.image = partslibrary[type].images[(this.angle % 90).toString()]
    this.startport = partslibrary[type].geometry[style].startport;
    this.imagerotation = partslibrary[type].geometry[style].imagerotation;
    this.imagemirror = partslibrary[type].geometry[style].imagemirror;

    // Build this piece's list of connection ports given its angle
    for (const port of partslibrary[type].geometry[style].ports) {
      console.log("Need to rotate around " + partslibrary[this.type].geometry[this.style].ports[this.startport].x + "," + partslibrary[this.type].geometry[this.style].ports[this.startport].y);

      let newport = this.rotatePort(port, this.angle);
      console.log(newport);
      this.ports.push(newport);
    }

    // Update which connection port should have something added next
    this.activeport = this.ports[this.startport].peer;
    
  }
 
  get cursor() {
    return({
      x: this.location.x - this.ports[this.startport].x + this.ports[this.activeport].x,
      y: this.location.y - this.ports[this.startport].y + this.ports[this.activeport].y,
      angle: this.angle + this.ports[this.activeport].angle
    });
  }

  draw(ctx) {
    let x = this.location.x;
    let y = this.location.y;

    let baseangle = Math.trunc(this.angle / 90) * 90;

    ctx.save();

    // Since rotate() rotates around grid lines and pixels are draw into grid squares, rotating
    // a pixel at 0,0 180 degrees around 0,0 effectively puts that pixel at -1,-1.  These lines shift the
    // location as needed to compensate for that.
    if (baseangle == 90) { x += 1; }
    if (baseangle == 180) { x += 1; y += 1; }
    if (baseangle == 270) { y += 1; }

    // Compensation done!  Time to rotate around this part's origin port
    ctx.translate(Math.round(x), Math.round(y));
    ctx.rotate(baseangle * Math.PI / 180);
    //ctx.rotate(this.imagerotation * Math.PI / 180);
    ctx.scale(1, this.imagemirror);
    ctx.translate(Math.round(x) * -1, Math.round(y) * -1);

    // ctx.drawImage(this.image.image, Math.round(x - this.image.ports[0].x), Math.round(y - this.image.ports[0].y));
    // ctx.drawImage(
    //   this.image.image,
    //   Math.round(x - this.image.ports[this.startport].x),
    //   Math.round(y - this.image.ports[this.startport].y)
    // );

    ctx.drawImage(
      this.image.image,
      Math.round(x - this.image.ports[this.startport].x),
      Math.round(y - this.image.ports[this.startport].y)
    );

    ctx.restore();
  }

  drawPorts(ctx) {
    let colors = ["blue", "red", "yellow", "black"];

    for (const port in this.ports) {
      let portx = this.location.x - this.ports[this.startport].x + this.ports[port].x;
      let porty = this.location.y - this.ports[this.startport].y + this.ports[port].y;

      console.log("port[" + port + "]: " + portx + ", " + porty);

      if (port > -1) {
        ctx.beginPath();
        ctx.strokeStyle = colors[port];
        ctx.fillStyle = colors[port];
        ctx.fillRect(
          Math.round( portx - 2 ),
          Math.round( porty - 2 ),
          5, 5
        );
        ctx.stroke();
      }
    }
  }

  //--- privateish stuff below

  // Find connection location within a rotated image
  rotatePort(port, angle) {
    console.log("Rotating " + port.x + "," + port.y + " to angle " + angle);
    let point = [port.x, port.y];
    // let pointprime = this.rotatePointAround(point, angle, [0, 0]);
    let pointprime = this.rotatePointAround(
      point, angle + this.imagerotation, [
        partslibrary[this.type].geometry[this.style].ports[this.startport].x,
        partslibrary[this.type].geometry[this.style].ports[this.startport].y
      ]
    );

    console.log(pointprime);

    return({ x: pointprime[0], y: pointprime[1], angle: port.angle, peer: port.peer });
  }

  rotatePoint(point, angle) {
    let theta = angle * Math.PI / 180;
  
    let pointprime = [
      (point[0] * Math.cos(theta)) - (point[1] * Math.sin(theta)),
      (point[0] * Math.sin(theta)) + (point[1] * Math.cos(theta))
    ];
  
    return(pointprime);
  }

  rotatePointAround(point, angle, around) {
    let newpoint = [
      point[0] - around[0],
      point[1] - around[1]
    ];
  
    let pointprime = this.rotatePoint(newpoint, angle);
  
    pointprime[0] += around[0];
    pointprime[1] += around[1];
  
    return(pointprime);
  }
}
