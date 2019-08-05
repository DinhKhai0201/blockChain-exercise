import web3cur from './web3Service';

const address = '0x2e69521e32669241082a03e2a71a89a8b3f37456';
const abi = [{"constant":false,"inputs":[{"name":"x","type":"string"}],"name":"sendHash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getHash","outputs":[{"name":"x","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ipfsHash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}]

let getContract = async(cb = ()=>{})=>{
  let web3 = await web3cur();
  const contract = new web3.eth.Contract(abi, address,{ gasPrice: 10000000000 });
  cb(contract, web3)
}
getContract();


// web3cur.eth.getAccounts(function(err, result) {
//   if (!err) {
//     console.log("getAccounts: ",result)
//   } 
// });
// web3cur.eth.getProtocolVersion(console.log)
// web3cur.eth.isSyncing(console.log)
// web3cur.eth.getCoinbase(function(err, getCoinbase) {
//   if (!err) {
//     console.log("getCoinbase: ",getCoinbase)
//   }
// })
// console.log("ultil", Web3.utils.randomHex(32))
// var BN = Web3.utils.BN;
// console.log("BN to string ",new BN(1234).toString())
// console.log("keccak ",Web3.utils.keccak256("string"))
// console.log("towei ",Web3.utils.toWei('1', 'ether'))
// console.log("to ether",Web3.utils.fromWei('1', 'ether'))
// web3cur.eth.getHashrate(console.log)
// web3cur.eth.getBalance("0x58258c78311b8ddEaD8650Ac1ab60F681FC5De43", (err, wei) => {
//         console.log(wei);
//     });
// myContract.events.MyEvent([options][, callback])

// web3cur.eth.sendTransaction({
//     from: '0xD6C23efb8c399dd7369CA490B4efAD86C8c885F3',
//     to: '0x7BdFBE40673e500D664455a177FFe2db3aD1eeE7',
//     value: '1000000000000000',
//     gasPrice: '100000000000'
// }, function(err, success) {
//   if (!err) {
//     console.log("success")
//   }
// })
// contract.methods.sendHash("hello").send({},function(err, result) {
//   console.log("sendHash :",result)
// })
// contract.methods.getHash().call(function(err, result) {
//   console.log("getHash: ",result)
// })
export {
  	getContract
}