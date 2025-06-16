let pinceles = [];
let nombresPinceles = [
  "1.png",
  "2.png",
  "3.png",
  "4.png",
  "5.png"
];

let colores = [];
let mic, amp;
let ultimoColor = null;

const AMP_MIN = 0.05; 
let bgColor = 255;
let canvasPinceles;

function preload() {
  for (let nombre of nombresPinceles) {
    pinceles.push(loadImage(`imagenes/${nombre}`));
  }
}

function setup() {
  createCanvas(400, 800);
  background(255);

  canvasPinceles = createGraphics(400, 800);
  canvasPinceles.clear();

  colores = [
    color(255, 0, 0),
    color(0, 0, 255),
    color(255, 255, 0),
    color(0, 255, 0),
    color(0),
  ];

  userStartAudio();
  mic = new p5.AudioIn();
  mic.start();
  amp = new p5.Amplitude();
  amp.setInput(mic);
}

function draw() {
  let volumen = amp.getLevel();
  volumen = constrain(volumen, 0, 0.3);


  bgColor = lerp(bgColor, map(volumen, 0, 0.3, 255, 180), 0.05);
  noStroke();
  fill(bgColor, 10);
  rect(0, 0, width, height);

  
  image(canvasPinceles, 0, 0);

  if (volumen > AMP_MIN) {
    
    let cantidad = floor(map(volumen, AMP_MIN, 0.3, 1, 5)); 

    for (let i = 0; i < cantidad; i++) {
      let escala = map(volumen, AMP_MIN, 0.3, 0.4, 2.0);

      let x = random(width);
      let y = random(height);

      let pincel = random(pinceles);
      let col = randomColoresBalanceados();

      canvasPinceles.tint(col);
      canvasPinceles.imageMode(CENTER);
      canvasPinceles.image(pincel, x, y, pincel.width * escala, pincel.height * escala);
      canvasPinceles.noTint();
    }
  }

  // bolita indicadora de volumen
  let r = map(volumen, 0, 0.3, 10, 100);
  noStroke();
  fill(100, 100, 255, 100);
  ellipse(width / 2, height - 50, r);

  fill(0, 100);
  noStroke();
  textSize(14);
  textAlign(CENTER);
  text("apretá 'R' para reiniciar", width / 2, height - 10);
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    background(255);
    canvasPinceles.clear();
  }
}

function randomColoresBalanceados() {
  let col;
  do {
    col = random(colores);
  } while (col === ultimoColor);
  ultimoColor = col;

  if (red(col) === 0 && green(col) === 0 && blue(col) === 0) {
    col.setAlpha(100); 
  } else {
    col.setAlpha(255); 
  }

  return col;
}
