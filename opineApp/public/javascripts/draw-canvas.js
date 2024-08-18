function addFontToCanvas(canvasId, size, fontWanted){
	document.getElementById(canvasId).getContext("2d").font = `500 ${size}px "${fontWanted}"`;
}

function draw() {	  
	const canvas = document.getElementById("graphicTitle");
	if (canvas.getContext) {
	  const ctx = canvas.getContext("2d");
	  
	  var x = canvas.width / 2;
	  var y = canvas.height / 2;
	  
	  const lineargradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
	  lineargradient.addColorStop(0, "#ab554f");
	  lineargradient.addColorStop(0.5, "#edf0fa");
	  lineargradient.addColorStop(1, "#476494");
	  
	  ctx.fillStyle = lineargradient;
	  ctx.strokeStyle = lineargradient;
	  ctx.textAlign = 'center';
	  ctx.textBaseline = 'middle';
	  
	  addFontToCanvas("graphicTitle", 100, "Sarabun");
	  ctx.fillText("Opine", x, y);  
	  
	  ctx.beginPath();
	  ctx.moveTo(25, 120);
	  ctx.quadraticCurveTo(x, 100, 250, 115);
	  ctx.lineWidth = 3.0;
	  ctx.stroke();
	}
}
  
window.addEventListener("load", draw);