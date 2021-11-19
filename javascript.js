function microcontrolador(entradaDados, processamento){
	this.PC = 0;
	this.SP = 0;
	this.memoria = {
		direto_8bit: [],
		indireto_8bit: [],
		direto_16bit: [],
		ram: []
	};
	processamento(0x00)
	entradaDados();
}
microcontrolador(pinos, cpu);
function pinos(){
	var runBin = window.document.getElementById('runBin');      
	var codigoBin = window.document.getElementById('codigoBin');
	var littleEngine = [0x00, 0x00];
	var binario, y, controller = 0;
	runBin.addEventListener('click', function(){
		binario = codigoBin.value;
		for (var x = 1; x <= (codigoBin.value.length / 4); x++){
			if (littleEngine[0] != 0x00 & littleEngine[1] != 0x00){
				cpu(littleEngine);
				littleEngine[0], littleEngine[1], y = 0x00;
			}else {	
				littleEngine[controller] = binario.slice((y * 2), (y * 4));
				if (controller != 2){
					controller += 1;
				}else{
					controller = 0;
				}
				y = 2 * y;
			}
		}
	});
}
function cpu(bin){
	window.alert(bin);
}
