var tela = window.document.getElementById('monitor')
function microcontrolador(){
	this.PC = 0
	this.SP = 0
	this.TIMER = 250
	Pinos()
}
microcontrolador()
/* 1110110100001000/0010110100010000/0001100000000001*/
function Pinos(){
	var codigo = window.document.getElementById('codigo')
	var botao = window.document.getElementById('btn')
	botao.addEventListener('click', function(){
		var codigoFont = String(codigo.value).split('')
		var bytes = ''
		var controle = 0
		for (var x = 0; x <= (codigo.value.length - 1); x++){
			if (controle != 4){
				 bytes += codigoFont[x]
				 controle ++
			}else{
				bytes += '#'
				x = x - 1
				controle = 0
			}
		}
		bytes = bytes.split('#')
		var binarioLittleEndian = littleEndian(bytes)
		cpu(binarioLittleEndian)
		window.alert(binarioLittleEndian+' / '+binarioLittleEndian.length)
	})
}
function littleEndian(bytes){
	var binarioInvertido = []
	var controller_dados = 2
	window.alert(bytes)
	for (var x = 0; x <= (bytes.length - 1); x++){
		if (controller_dados <= 3){
			binarioInvertido[x] = bytes[x + 2]
			controller_dados = controller_dados + 1
		}else{
			binarioInvertido[x] = bytes[x - 2]
			x = x + 1
			binarioInvertido[x] = bytes[x - 2]
			controller_dados = 2
		}
	}
	return binarioInvertido
}
function cpu(bytes){
	var controle_cpu = true
	var clock = setInterval(function(){
		if ((bytes.length - 1) >= PC & controle_cpu != false){
			mapMemoria.memoriaDados[PC] = bytes[PC]
			//window.document.writeln(mapMemoria.memoriaDados[PC])
			PC = PC + 1
		}else{
			if (controle_cpu != false){
				PC = 0
			}else{
				if ((bytes.length - 1) >= PC){
				var comando = mapMemoria.memoriaDados[PC]
				PC = PC + 1
				setInstrucao(comando, PC)
				}
			}
			controle_cpu = false
		}
		tela.innerHTML = ' ~ ' + PC + ' / ' + comando + ' / ' + 'Rd: ' + Rd + ' - Rr: '+Rr+'<br> # memoria de dados: '+mapMemoria.memoriaDados+'<br> registrador de trabalhor indireto: '+String(mapMemoria.regitradorTrabalho._8bit.indireto) + '<br> regitrador de trabalho direto: ' + mapMemoria.regitradorTrabalho._8bit.direto
	}, TIMER)
}
var Rd, Rr, P, b, R_x, R_y, R_z, k, conf_pinos
function setInstrucao(c, apontar){
	apontar = apontar - 1
	// r16 = 0 r17 = 1 r18 = 2 r19 = 3 r20 = 4 r21 = 5 r22 = 6 r23 = 7 r24 = 8 r25 = 9 26 = 10 27 = 11 28 = 12 29 = 13 30 = 14 31 = 15
	var opCode = {
		'0b1110': function LDI(){
		    Rd = parseInt(mapMemoria.memoriaDados[apontar - 2], 2)
			if (Rd <= 9){
				Rr = mapMemoria.memoriaDados[apontar + 1] + mapMemoria.memoriaDados[apontar - 1]
				mapMemoria.regitradorTrabalho._8bit.direto[Rd] = Rr
			}else{
				Rr = mapMemoria.memoriaDados[apontar + 1] + mapMemoria.memoriaDados[apontar - 1]
				if (Rd == '10' || Rd == '11'){
					mapMemoria.regitradorTrabalho._16bit.x[Rd] = Rr		
				}else if(Rd == '12' || Rd == '13'){
					mapMemoria.regitradorTrabalho._16bit.y[Rd] = Rr	
				}else if(Rd == '14' || Rd == '15'){
					mapMemoria.regitradorTrabalho._16bit.z[Rd] = Rr	
				}
			}
			//window.document.writeln('Rd: '+ mapMemoria.memoriaDados[apontar + 1]+ '  /  Rr: ' +mapMemoria.memoriaDados[apontar + 3]+ ' valor salvo :' + mapMemoria.regitradorTrabalho._8bit.direto[Rd])
		},
		'0b0010': function MOV(){
			Rd = mapMemoria.memoriaDados[apontar + 1].slice(0, 2)
			if (Rd == '11'){
				Rd = mapMemoria.memoriaDados[apontar + 1]//.slice(2, 4)
				switch(Rd){
					case '1100':
						Rr = parseInt(mapMemoria.memoriaDados[apontar - 1], 2)
						Rr = mapMemoria.regitradorTrabalho._8bit.indireto[Rr]
						mapMemoria.regitradorTrabalho._8bit.indireto[parseInt(mapMemoria.memoriaDados[apontar + 1], 2)] = ''
						Rd = parseInt(mapMemoria.memoriaDados[apontar - 2] ,2)
						mapMemoria.regitradorTrabalho._8bit.indireto[Rd] = Rr
						//window.alert(Rd + ' / ' + parseInt(mapMemoria.regitradorTrabalho._8bit.indireto[Rd], 2))
					break
					case '1110':
						Rr = parseInt(mapMemoria.memoriaDados[apontar - 1], 2)
						Rr = mapMemoria.regitradorTrabalho._8bit.indireto[Rr]
						mapMemoria.regitradorTrabalho._8bit.indireto[parseInt(mapMemoria.memoriaDados[apontar - 1], 2)] = ''
						Rd = parseInt(mapMemoria.memoriaDados[apontar - 2] ,2)
						if (Rd <= 9){
							mapMemoria.regitradorTrabalho._8bit.direto[Rd] = Rr
						}else{
							if (Rd == '10' || Rd == '11'){
								mapMemoria.regitradorTrabalho._16bit.x[Rd] = Rd
							}else if(Rd == '12' || Rd == '13'){
								mapMemoria.regitradorTrabalho._16bit.y[Rd] = Rd
							}else if(Rd == '14' || Rd == '15'){
								mapMemoria.regitradorTrabalho._16bit.z[Rd] = Rd
							}
						}
					break
					case '1101':
						Rr = parseInt(mapMemoria.memoriaDados[apontar - 1], 2)
						if (Rr <= 9){
							Rr = mapMemoria.regitradorTrabalho._8bit.direto[Rr]
							mapMemoria.regitradorTrabalho._8bit.direto[parseInt(mapMemoria.memoriaDados[apontar - 1], 2)] = ''
							Rd = parseInt(mapMemoria.memoriaDados[apontar - 2] ,2)
							mapMemoria.regitradorTrabalho._8bit.indireto[Rd] = Rr
							//window.alert(mapMemoria.regitradorTrabalho._8bit.indireto[Rd])
						}else{
							if (Rr == '10' || Rr == '11'){
								//window.alert(Rr)
								Rr = mapMemoria.regitradorTrabalho._16bit.x[Rr]
							}else if(Rr == '12' || Rr == '13'){
								//window.alert(Rr)
								Rr = mapMemoria.regitradorTrabalho._16bit.y[Rr]
							}else if(Rr == '14' || Rr == '15'){
								//window.alert(Rr)
								Rr = mapMemoria.regitradorTrabalho._16bit.z[Rr]
							}
						}
						mapMemoria.regitradorTrabalho._8bit.direto[parseInt(mapMemoria.memoriaDados[apontar - 1], 2)] = ''
						Rd = parseInt(mapMemoria.memoriaDados[apontar - 2] ,2)
						mapMemoria.regitradorTrabalho._8bit.indireto[Rd] = Rr
						//window.alert(mapMemoria.regitradorTrabalho._8bit.indireto[Rd])
					break
					case '1111':
						Rr = parseInt(mapMemoria.memoriaDados[apontar - 1], 2)
						Rd = parseInt(mapMemoria.memoriaDados[apontar - 2], 2)
						//window.alert(Rr + 'r   /   d' + Rd)
						if (Rr <= 9){
							Rr = mapMemoria.regitradorTrabalho._8bit.direto[Rr]
							salva(Rr)
						}else{
							if (Rr == '10' || Rr == '11'){
								//window.alert('10 ou 11 w')
								Rr = mapMemoria.regitradorTrabalho._16bit.x[Rr]
								salva(Rr)
							}else if(Rr == '12' || Rr == '13'){
								//window.alert('12 ou 13 w')
								Rr = mapMemoria.regitradorTrabalho._16bit.y[Rr]
								salva(Rr)
							}else if(Rr == '14' || Rr == '15'){
								//window.alert('14 ou 15 w')
								Rr = mapMemoria.regitradorTrabalho._16bit.z[Rr]
								salva(Rr)
							}
						}
						function salva(valor){
							//window.alert(Rd)
							if (Rd <= 9){
								mapMemoria.regitradorTrabalho._8bit.direto[parseInt(mapMemoria.memoriaDados[apontar - 1], 2)]
								mapMemoria.regitradorTrabalho._8bit.direto[Rd] = Rr
							}else{
								if (Rd == '10' || Rd == '11'){
								//	window.alert('10 ou 11')
									mapMemoria.regitradorTrabalho._16bit.x[parseInt(mapMemoria.memoriaDados[apontar - 1], 2)]
									mapMemoria.regitradorTrabalho._16bit.x[Rd] = valor
								}else if (Rd == '12' || Rd == '13'){
								//	window.alert('12 ou 13')
									mapMemoria.regitradorTrabalho._16bit.y[parseInt(mapMemoria.memoriaDados[apontar - 1], 2)]
									mapMemoria.regitradorTrabalho._16bit.y[Rd] = valor
								}else if (Rd == '14' || Rd == '15'){
									//window.alert('14 ou 15')
									mapMemoria.regitradorTrabalho._16bit.z[parseInt(mapMemoria.memoriaDados[apontar - 1], 2)]
									mapMemoria.regitradorTrabalho._16bit.z[Rd] = valor
								}
							}
						}
						// 11101101110011000010111111111100
						window.alert(mapMemoria.regitradorTrabalho._16bit.z[Rd])
					break
				}
			}else if(Rd == '01'){
				// clr - 11101101000011000010011100000000
				(function CLR(){
					Rd = mapMemoria.memoriaDados[apontar + 1]
					if (Rd == '0111'){
						Rd = parseInt(mapMemoria.memoriaDados[apontar - 2], 2)
						if (Rd <= 9){
							mapMemoria.regitradorTrabalho._8bit.direto[Rd] = ''
						}else if (Rd == '10' || Rd == '11'){
							mapMemoria.regitradorTrabalho._16bit.x[Rd] = ''
						}else if(Rd == '12' || Rd == '13'){
							mapMemoria.regitradorTrabalho._16bit.y[Rd] = ''
						}else if(Rd == '14' || Rd == '15'){
							mapMemoria.regitradorTrabalho._16bit.z[Rd] = ''
						}
					}else if(Rd == '0100'){
						Rd = mapMemoria.memoriaDados[apontar - 2]
						mapMemoria.regitradorTrabalho._8bit.indireto[Rd] = ''
					}
				})()
				// window.alert(mapMemoria.regitradorTrabalho._8bit.direto[Rd])
			}
		},
		'0b0001': function SUB(){
			Rd = mapMemoria.memoriaDados[apontar + 1]
			switch(Rd){
				// 0001100000000001
				case '1000':
					Rd = parseInt(mapMemoria.memoriaDados[apontar - 2], 2)
					Rr = parseInt(mapMemoria.memoriaDados[apontar - 1], 2)
					Rd = mapMemoria.regitradorTrabalho._8bit.indireto[Rd]
					Rr = mapMemoria.regitradorTrabalho._8bit.indireto[Rr]
					Rd = parseInt(Rd, 2) - parseInt(Rr, 2)
					Rd = (Rd >>> 0).toString(2)
					mapMemoria.regitradorTrabalho._8bit.indireto[parseInt(mapMemoria.memoriaDados[apontar - 2], 2)] = Rd
				break
				case '1001':
					Rd = parseInt(mapMemoria.memoriaDados[apontar - 2], 2)
					Rr = parseInt(mapMemoria.memoriaDados[apontar - 1], 2)
					Rd = mapMemoria.regitradorTrabalho._8bit.indireto[Rd]
					if (Rr <= 9){
						Rr = mapMemoria.regitradorTrabalho._8bit.direto[Rr]
					}else if(Rr == '10' || Rr == '11'){
						Rr = mapMemoria.regitradorTrabalho._16bit.x[Rr]
					}else if (Rr == '12' || Rr == '13'){
						Rr = mapMemoria.regitradorTrabalho._16bit.y[Rr]
					}else if(Rr == '14' || Rr == '15'){
						Rr = mapMemoria.regitradorTrabalho._16bit.z[Rr]
					}
					Rd = parseInt(Rd, 2) - parseInt(Rr, 2)
					Rd = (Rd >>> 0).toString(2)
					mapMemoria.regitradorTrabalho._8bit.indireto[parseInt(mapMemoria.memoriaDados[apontar - 2], 2)] = Rd
				break
				case '1010':
					Rd = parseInt(mapMemoria.memoriaDados[apontar - 2], 2)
					Rr = parseInt(mapMemoria.memoriaDados[apontar - 1], 2)
					Rr = mapMemoria.regitradorTrabalho._8bit.indireto[Rr]
					if (Rd <= 9){
						Rd = mapMemoria.regitradorTrabalho._8bit.direto[Rd]
						Rd = parseInt(Rd, 2) - parseInt(Rr, 2)
						Rd = (Rd >>> 0).toString(2)
						mapMemoria.regitradorTrabalho._8bit.direto[parseInt(mapMemoria.memoriaDados[apontar - 2], 2)] = Rd
					}else if(Rd == '10' || Rd == '11'){
						Rd = mapMemoria.regitradorTrabalho._16bit.x[Rd]
						Rd = parseInt(Rd, 2) - parseInt(Rr, 2)
						Rd = (Rd >>> 0).toString(2)
						mapMemoria.regitradorTrabalho._16bit.x[parseInt(mapMemoria.memoriaDados[apontar - 2], 2)] = Rd
					}else if (Rd == '12' || Rd == '13'){
						Rd = mapMemoria.regitradorTrabalho._16bit.y[Rd]
						Rd = parseInt(Rd, 2) - parseInt(Rr, 2)
						Rd = (Rd >>> 0).toString(2)
						mapMemoria.regitradorTrabalho._16bit.y[parseInt(mapMemoria.memoriaDados[apontar - 2], 2)] = Rd
					}else if(Rd == '14' || Rd == '15'){
						Rd = mapMemoria.regitradorTrabalho._16bit.z[Rd]
						Rd = parseInt(Rd, 2) - parseInt(Rr, 2)
						Rd = (Rd >>> 0).toString(2)
						mapMemoria.regitradorTrabalho._16bit.z[parseInt(mapMemoria.memoriaDados[apontar - 2], 2)] = Rd
					}
				break
				case '1011':
					Rd = parseInt(mapMemoria.memoriaDados[apontar - 2], 2)
					Rr = parseInt(mapMemoria.memoriaDados[apontar - 1], 2)
					if (Rr <= 9){
						Rr = mapMemoria.regitradorTrabalho._8bit.direto[Rr]
					}else if(Rr == '10' || Rr == '11'){
						Rr = mapMemoria.regitradorTrabalho._16bit.x[Rr]
					}else if (Rr == '12' || Rr == '13'){
						Rr = mapMemoria.regitradorTrabalho._16bit.y[Rr]
					}else if(Rr == '14' || Rr == '15'){
						Rr = mapMemoria.regitradorTrabalho._16bit.z[Rr]
					}
					if (Rd <= 9){
						Rd = mapMemoria.regitradorTrabalho._8bit.direto[Rd]
						Rd = parseInt(Rd, 2) - parseInt(Rr, 2)
						Rd = (Rd >>> 0).toString(2)
						mapMemoria.regitradorTrabalho._8bit.direto[parseInt(mapMemoria.memoriaDados[apontar - 2], 2)] = Rd
					}else if(Rd == '10' || Rd == '11'){
						Rd = mapMemoria.regitradorTrabalho._16bit.x[Rd]
						Rd = parseInt(Rd, 2) - parseInt(Rr, 2)
						Rd = (Rd >>> 0).toString(2)
						mapMemoria.regitradorTrabalho._16bit.x[parseInt(mapMemoria.memoriaDados[apontar - 2], 2)] = Rd
					}else if (Rd == '12' || Rd == '13'){
						Rd = mapMemoria.regitradorTrabalho._16bit.y[Rd]
						Rd = parseInt(Rd, 2) - parseInt(Rr, 2)
						Rd = (Rd >>> 0).toString(2)
						mapMemoria.regitradorTrabalho._16bit.y[parseInt(mapMemoria.memoriaDados[apontar - 2], 2)] = Rd
					}else if(Rd == '14' || Rd == '15'){
						Rd = mapMemoria.regitradorTrabalho._16bit.z[Rd]
						Rd = parseInt(Rd, 2) - parseInt(Rr, 2)
						Rd = (Rd >>> 0).toString(2)
						mapMemoria.regitradorTrabalho._16bit.z[parseInt(mapMemoria.memoriaDados[apontar - 2], 2)] = Rd
					}
				break
			}
		},
		'0b1001': function INC(){
			// 11101101000011001001010100000000
			Rd = mapMemoria.memoriaDados[apontar + 1].slice(0, 3)
			if (Rd == '010'){
					Rd = mapMemoria.memoriaDados[apontar + 1].slice(3,4)
					//window.alert(Rd)
				if(Rd == '1' & mapMemoria.memoriaDados[apontar - 1] == mapMemoria.memoriaDados[apontar - 2]){
					Rd = parseInt(mapMemoria.memoriaDados[apontar - 2], 2)
					//window.alert(Rd)
					if (Rd <= 9){
						Rd = parseInt(mapMemoria.regitradorTrabalho._8bit.direto[Rd], 2)
						Rd = ((Rd + 1) >>> 0).toString(2)
						mapMemoria.regitradorTrabalho._8bit.direto[parseInt(mapMemoria.memoriaDados[apontar - 2], 2)] = Rd
						//window.alert(Rd)
					}else{
						Rd = parseInt(mapMemoria.regitradorTrabalho._8bit.direto[Rd], 2)
						if (Rd == '10' || Rd == '11'){
							Rd = ((Rd + 1) >>> 0).toString(2)
							mapMemoria.regitradorTrabalho._16bit.x[Rd] = Rd
						}else if(Rd == '12' || Rd == '13'){
							Rd = ((Rd + 1) >>> 0).toString(2)
							mapMemoria.regitradorTrabalho._16bit.y[Rd] = Rd
						}else if(Rd == '14' || Rd == '15'){
							Rd = ((Rd + 1) >>> 0).toString(2)
							mapMemoria.regitradorTrabalho._16bit.z[Rd] = Rd
						}
					}
				}else if(Rd == '0' & mapMemoria.memoriaDados[apontar - 1] == mapMemoria.memoriaDados[apontar - 2]){
						Rd = parseInt(mapMemoria.regitradorTrabalho._8bit.indireto[Rd], 2)
						Rd = ((Rd + 1) >>> 0).toString(2)
						mapMemoria.regitradorTrabalho._8bit.indireto[parseInt(mapMemoria.memoriaDados[apontar - 2], 2)] = Rd
				}
			}else{
				(function DEC(){
					
				})()
			}
		},
		'0b0000': function ADD(){
			Rd = mapMemoria.memoriaDados[apontar + 1]
			switch(Rd){
				// 0000100000000001
				case '1100':
					Rd = parseInt(mapMemoria.memoriaDados[apontar - 2], 2)
					Rr = parseInt(mapMemoria.memoriaDados[apontar - 1], 2)
					Rd = mapMemoria.regitradorTrabalho._8bit.indireto[Rd]
					Rr = mapMemoria.regitradorTrabalho._8bit.indireto[Rr]
					Rd = parseInt(Rd, 2) + parseInt(Rr, 2)
					Rd = (Rd >>> 0).toString(2)
					mapMemoria.regitradorTrabalho._8bit.indireto[parseInt(mapMemoria.memoriaDados[apontar - 2], 2)] = Rd
				break
				case '1101':
					Rd = parseInt(mapMemoria.memoriaDados[apontar - 2], 2)
					Rr = parseInt(mapMemoria.memoriaDados[apontar - 1], 2)
					Rd = mapMemoria.regitradorTrabalho._8bit.indireto[Rd]
					if (Rr <= 9){
						Rr = mapMemoria.regitradorTrabalho._8bit.direto[Rr]
					}else if(Rr == '10' || Rr == '11'){
						Rr = mapMemoria.regitradorTrabalho._16bit.x[Rr]
					}else if (Rr == '12' || Rr == '13'){
						Rr = mapMemoria.regitradorTrabalho._16bit.y[Rr]
					}else if(Rr == '14' || Rr == '15'){
						Rr = mapMemoria.regitradorTrabalho._16bit.z[Rr]
					}
					Rd = parseInt(Rd, 2) + parseInt(Rr, 2)
					Rd = (Rd >>> 0).toString(2)
					mapMemoria.regitradorTrabalho._8bit.indireto[parseInt(mapMemoria.memoriaDados[apontar - 2], 2)] = Rd
				break
				case '1110':
					Rd = parseInt(mapMemoria.memoriaDados[apontar - 2], 2)
					Rr = parseInt(mapMemoria.memoriaDados[apontar - 1], 2)
					Rr = mapMemoria.regitradorTrabalho._8bit.indireto[Rr]
					if (Rd <= 9){
						Rd = mapMemoria.regitradorTrabalho._8bit.direto[Rd]
						Rd = parseInt(Rd, 2) + parseInt(Rr, 2)
						Rd = (Rd >>> 0).toString(2)
						mapMemoria.regitradorTrabalho._8bit.direto[parseInt(mapMemoria.memoriaDados[apontar - 2], 2)] = Rd
					}else if(Rd == '10' || Rd == '11'){
						Rd = mapMemoria.regitradorTrabalho._16bit.x[Rd]
						Rd = parseInt(Rd, 2) + parseInt(Rr, 2)
						Rd = (Rd >>> 0).toString(2)
						mapMemoria.regitradorTrabalho._16bit.x[parseInt(mapMemoria.memoriaDados[apontar - 2], 2)] = Rd
					}else if (Rd == '12' || Rd == '13'){
						Rd = mapMemoria.regitradorTrabalho._16bit.y[Rd]
						Rd = parseInt(Rd, 2) + parseInt(Rr, 2)
						Rd = (Rd >>> 0).toString(2)
						mapMemoria.regitradorTrabalho._16bit.y[parseInt(mapMemoria.memoriaDados[apontar - 2], 2)] = Rd
					}else if(Rd == '14' || Rd == '15'){
						Rd = mapMemoria.regitradorTrabalho._16bit.z[Rd]
						Rd = parseInt(Rd, 2) + parseInt(Rr, 2)
						Rd = (Rd >>> 0).toString(2)
						mapMemoria.regitradorTrabalho._16bit.z[parseInt(mapMemoria.memoriaDados[apontar - 2], 2)] = Rd
					}
				break
				case '1111':
					Rd = parseInt(mapMemoria.memoriaDados[apontar - 2], 2)
					Rr = parseInt(mapMemoria.memoriaDados[apontar - 1], 2)
					if (Rr <= 9){
						Rr = mapMemoria.regitradorTrabalho._8bit.direto[Rr]
					}else if(Rr == '10' || Rr == '11'){
						Rr = mapMemoria.regitradorTrabalho._16bit.x[Rr]
					}else if (Rr == '12' || Rr == '13'){
						Rr = mapMemoria.regitradorTrabalho._16bit.y[Rr]
					}else if(Rr == '14' || Rr == '15'){
						Rr = mapMemoria.regitradorTrabalho._16bit.z[Rr]
					}
					if (Rd <= 9){
						Rd = mapMemoria.regitradorTrabalho._8bit.direto[Rd]
						Rd = parseInt(Rd, 2) + parseInt(Rr, 2)
						Rd = (Rd >>> 0).toString(2)
						mapMemoria.regitradorTrabalho._8bit.direto[parseInt(mapMemoria.memoriaDados[apontar - 2], 2)] = Rd
					}else if(Rd == '10' || Rd == '11'){
						Rd = mapMemoria.regitradorTrabalho._16bit.x[Rd]
						Rd = parseInt(Rd, 2) + parseInt(Rr, 2)
						Rd = (Rd >>> 0).toString(2)
						mapMemoria.regitradorTrabalho._16bit.x[parseInt(mapMemoria.memoriaDados[apontar - 2], 2)] = Rd
					}else if (Rd == '12' || Rd == '13'){
						Rd = mapMemoria.regitradorTrabalho._16bit.y[Rd]
						Rd = parseInt(Rd, 2) + parseInt(Rr, 2)
						Rd = (Rd >>> 0).toString(2)
						mapMemoria.regitradorTrabalho._16bit.y[parseInt(mapMemoria.memoriaDados[apontar - 2], 2)] = Rd
					}else if(Rd == '14' || Rd == '15'){
						Rd = mapMemoria.regitradorTrabalho._16bit.z[Rd]
						Rd = parseInt(Rd, 2) + parseInt(Rr, 2)
						Rd = (Rd >>> 0).toString(2)
						mapMemoria.regitradorTrabalho._16bit.z[parseInt(mapMemoria.memoriaDados[apontar - 2], 2)] = Rd
					}
				break
			}
		},
		'0b1100': function RJMP(){
			// 111000000000000010010101000000001100111111111011
			k = mapMemoria.memoriaDados[apontar + 1]
			if (k == '1111'){
				k = mapMemoria.memoriaDados[apontar + 1] + mapMemoria.memoriaDados[apontar - 2] + mapMemoria.memoriaDados[apontar - 1]
				k = parseInt(k, 2)
				PC = (PC - 1) - (4095 - k)
				//window.alert(apontar)
			}
		},
		'0b1011': function OUT(){
			// 111011110000111110111011000001111011111100001000
			P = mapMemoria.memoriaDados[apontar + 1].slice(0, 1)
			if (P == '1'){
				P = mapMemoria.memoriaDados[apontar + 1].slice(1, 3) + mapMemoria.memoriaDados[apontar - 1]
				Rr = parseInt(mapMemoria.memoriaDados[apontar + 1].slice(3, 4))
				if (Rr == 0){
					Rr = parseInt(mapMemoria.memoriaDados[apontar - 2], 2)
					Rr = mapMemoria.regitradorTrabalho._8bit.indireto[Rr]
				}else{
					if (Rr <= 9){
						Rr = parseInt(mapMemoria.memoriaDados[apontar - 2], 2)
						Rr = mapMemoria.regitradorTrabalho._8bit.direto[Rr]
					}else if(Rr == '10' || Rr == '11'){
						Rr = parseInt(mapMemoria.memoriaDados[apontar - 2], 2)
						Rr = mapMemoria.regitradorTrabalho._16bit.x[Rr]
					}else if(Rr == '12' || Rr == '13'){
						Rr = parseInt(mapMemoria.memoriaDados[apontar - 2], 2)
						Rr = mapMemoria.regitradorTrabalho._16bit.y[Rr]
					}else if(Rr == '14' || Rr == '15'){
						Rr = parseInt(mapMemoria.memoriaDados[apontar - 2], 2)
						Rr = mapMemoria.regitradorTrabalho._16bit.z[Rr]
					}
				}
				conf_pinos = String(Rr).split('')
				//window.alert(conf_pinos)
			} // fim
		}
	}
	var fun = opCode['0b' + c]
	fun()
}
var mapMemoria = {
	regitradorTrabalho: {
		_8bit: {
			indireto: [],
			direto: []
		},
		_16bit: {
			x: [],
			y: [],
			z: []
		}
	},
	memoriaDados: [],
	ram: []
}
// emulacao do displayer
var led_A = window.document.getElementById('led_a')
var led_B = window.document.getElementById('led_b')
var led_C = window.document.getElementById('led_c')
var led_D = window.document.getElementById('led_d')
var led_E = window.document.getElementById('led_e')
var led_F = window.document.getElementById('led_f')
var led_G = window.document.getElementById('led_g')
var led_DP = window.document.getElementById('led_dp')
var pinosDisplayer = ''
function emulacao_displayer(){
	var chamaFunction = setInterval(function(){
		for (var x = 0;x <= (conf_pinos.length - 1); x++){
			pinosDisplayer += conf_pinos[x]
			opcodeDispleyer(pinosDisplayer[x], x)
			if (x == (conf_pinos.length - 1)){
				pinosDisplayer = ''
			}
		}
		emulacao_displayer()
	}, 100)
}
emulacao_displayer()
function opcodeDispleyer(instrucao, apontador){
	instrucao = instrucao.split('')
	// 111000000000010110111011000001111011111100001000
	//window.alert(instrucao)
	switch(apontador){
		case 0:
			if (instrucao == '1'){
				led_A.style.backgroundColor = 'red'
			}else{
				led_A.style.backgroundColor = '#fff'
			}
		break
		case 1:
			if (instrucao == '1'){
				led_B.style.backgroundColor = 'red'
			}else{
				led_B.style.backgroundColor = '#fff'
			}
		break
		case 2:
			if (instrucao == '1'){
				led_C.style.backgroundColor = 'red'
			}else{
				led_C.style.backgroundColor = '#fff'
			}
		break
		case 3:
			if (instrucao == '1'){
				led_D.style.backgroundColor = 'red'
			}else{
				led_D.style.backgroundColor = '#fff'
			}
		break
		case 4:
			if (instrucao == '1'){
				led_E.style.backgroundColor = 'red'
			}else{
				led_E.style.backgroundColor = '#fff'
			}
		break
		case 5:
			if (instrucao == '1'){
				led_F.style.backgroundColor = 'red'
			}else{
				led_F.style.backgroundColor = '#fff'
			}
		break
		case 6:
			if (instrucao == '1'){
				led_G.style.backgroundColor = 'red'
			}else{
				led_G.style.backgroundColor = '#fff'
			}
		break
		case 7:
			if (instrucao == '1'){
				led_DP.style.backgroundColor = 'red'
			}else{
				led_DP.style.backgroundColor = '#fff'
			}
		break
	}
}
