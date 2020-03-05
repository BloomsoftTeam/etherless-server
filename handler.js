'use strict';

module.exports.hello = async event => {
	const ethers = require("ethers");
	const vm = require("vm");
	const util = require("util");
	const fs = require("fs");

	const provider = new ethers.providers.InfuraProvider('ropsten', '048704ebedbd4239bc0d528e70e40ff9'); 
	const indirizzoContratto = '0x6C9a34F5343B15314869b839b1b2e2dC1F8cE016';
	let abiContratto = "[{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"fCode\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"fParameters\",\"type\":\"string\"}],\"name\":\"runRequest\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"fResult\",\"type\":\"uint256\"}],\"name\":\"runResult\",\"type\":\"event\"},{\"constant\":true,\"inputs\":[],\"name\":\"getString\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"string\",\"name\":\"fCode\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"fParameters\",\"type\":\"string\"}],\"name\":\"sendRunEvent\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"fResult\",\"type\":\"uint256\"}],\"name\":\"sendRunResult\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]" ;

	const userWallet = new ethers.Wallet("0xc06d007178f5141e3ef38725c1f4be28507e3c10d85eba1eb519ccefbb3ad12a", provider);

	const contractRun = new ethers.Contract(indirizzoContratto, abiContratto, provider).connect(userWallet);


	contractRun.on("runRequest", (fName, fParameters) => {
		console.log("Ricevuto codice da eseguire ");
		console.log(fName);
		console.log(fParameters);
		var parametersArray = [];
		if(fParameters.length != 0){
			var finish = false;
			while(!finish){
                if(fParameters.indexOf(',') == -1){
                    parametersArray[parametersArray.length] = fParameters.trim();
                    finish = true;
                }else{
                    parametersArray[parametersArray.length] = (fParameters.substring(0, fParameters.indexOf(','))).trim();
                    //Rimuove il parametro aggiunto e la virgola
                    fParameters = fParameters.replace(fParameters.substring(0, fParameters.indexOf(',')+1), "");
                }
            }
		}
		for(var i=0; i<parametersArray.length; i++){
			console.log(parametersArray[i]);
		}
		let path = fName + ".js";
		let sourceCode = fs.readFileSync(path, "utf8"); 

		var initSandbox = {
			x: parseInt(parametersArray[0]),
			y: parseInt(parametersArray[1]),
			functionResult: 0
		} // parametri della funzione
		var context = vm.createContext(initSandbox);
			
		//Esecuzione del codice
		vm.runInContext(sourceCode, context);
		var result = parseInt(util.inspect(context.functionResult));
		console.log(typeof result);
		contractRun.sendRunResult(result).then(console.log);
	} );
	

	return {
		statusCode: 200,
		body: JSON.stringify(
			{
				message: "Hello" ,
				input: event,
			},
			null,
			2
		),
	};
};
