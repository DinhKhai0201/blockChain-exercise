const Web3 = require('web3')
var http = require("http");

http.createServer(function (request, response) {
   response.writeHead(200, {'Content-Type': 'text/plain'});
   response.end('Hello World\n');
   let web3
    if (window.ethereum) {
        let instance = new Web3(window.ethereum);
        try {
            // Request account access if needed
            window.web3.enable();
            // Acccounts now exposed
            web3 = instance;
        } catch (error) {
            // User denied account access...
            alert('Please allow access for the app to work');
        }
    } else if (window.ethereum) {
        web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
    }
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
   // Send the response body as "Hello World"
   
}).listen(3001);

// Console will print the message
console.log('Server running at http://127.0.0.1:3001/');

// const rpcURL = 'https://ropsten.infura.io/v3/2031132f63974c11a99b747974c79938' // Your RCP URL goes here
// const web3 = new Web3(rpcURL)
// const abi = [
//     {
//         "constant": false,
//         "inputs": [
//             {
//                 "name": "x",
//                 "type": "string"
//             }
//         ],
//         "name": "sendHash",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "getHash",
//         "outputs": [
//             {
//                 "name": "x",
//                 "type": "string"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     }
// ]
// const address = '0x22b6acd52a80540260376236d904e20b5b889246'
// const contract = new web3.eth.Contract(abi, address, { gasPrice: 3000000 })
    // web3.eth.getBalance("0x58258c78311b8ddEaD8650Ac1ab60F681FC5De43", (err, wei) => {
    //     balance = web3.utils.fromWei(wei, 'ether');
    //     console.log(balance);
    // });
// contract.methods.totalSupply().call().then((result) => { console.log(result)});
// contract.methods.totalSupply().call().then((result) => { console.log(result/0xDE0B6B3A7640000)});
// //contract.methods.name().call().then((result) => { console.log(result) });
// contract.methods.goods(1).call().then(result => console.log(result));

// //contract.methods.
// contract.methods.lenghtGood().call().then((result) => { console.log(web3.utils.hexToNumber(result))})

//   toNumber = (val) =>{
//     // div 10^18
//     return val/0xDE0B6B3A7640000;
//   }