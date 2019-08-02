import Web3 from 'web3';

const rpcURL = "https://ropsten.infura.io/v3/cf658270146645bca881f8a7d4752099" 
let web3cur = new Promise((resolve, reject)=>{
    window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.enable();
            let cur = new Web3(window.ethereum);
            console.log("Metamask");
            resolve(cur);
        } catch (error) {
            alert('Please allow access for the app to work');
            reject(null);
        }
    } else {
        let cur = new Web3(new Web3.providers.HttpProvider(rpcURL));
        console.log("No Metamask")
        resolve(cur);
        }
    })
});

let web3 = async()=>web3cur;
export default web3; //default thi khi import thi de ten chi cung duoc