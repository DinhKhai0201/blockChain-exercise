import {Table, Button, Form } from 'react-bootstrap';
import React, { Component } from 'react';
import './App.css';
import ipfs from './ipfs';
import {getContract} from './contractService';

class App extends Component {
    constructor(props){
      super(props);
      this.state = {
        ipfsHash:'',
        account: '',
        buffer:'',
        ethAddress:'',
        blockNumber:'',
        transactionHash:'',
        gasUsed:'',
        txReceipt: ''   
      } 
    }
    componentDidMount(){
      const ipfs = (contracts, web3) => {
        let that = this;
         contracts.methods.ipfsHash().call({},function(err, result) {
          that.setState({ipfsHash: web3.utils.sha3(result)})
        })
      }
      getContract(ipfs);
      const account = (contracts, web3) => {
        let that = this;
         web3.eth.getCoinbase(function(err, result) {
          that.setState({account: result})
        })
      }
      getContract(account);
    }
    // captureFile =(event) => {
    //   event.stopPropagation()
    //   event.preventDefault()
    //   const file = event.target.files[0]
    //   let reader = new window.FileReader()
    //   reader.readAsArrayBuffer(file)
    //   reader.onloadend = () => this.convertToBuffer(reader)    
    // };

    // convertToBuffer = async(reader) => {
    //   //file is converted to a buffer to prepare for uploading to IPFS
    //     const buffer = await Buffer.from(reader.result);
    //   //set this buffer -using es6 syntax
    //     this.setState({buffer});
    // };

    // onClick = async () => {

    //   try{
    //       this.setState({blockNumber:"waiting.."});
    //       this.setState({gasUsed:"waiting..."});

    //       // get Transaction Receipt in console on click
    //       // See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
    //       await web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt)=>{
    //         console.log(err,txReceipt);
    //         this.setState({txReceipt});
    //       }); //await for getTransactionReceipt

    //       await this.setState({blockNumber: this.state.txReceipt.blockNumber});
    //       await this.setState({gasUsed: this.state.txReceipt.gasUsed});    
    //     } catch(error){
    //       console.log(error);
    //     } //catch
    // } 

  //onClick

    // onSubmit = async (event) => {
    //   event.preventDefault();

    //   //bring in user's metamask account address
    //   const accounts = await web3.eth.getAccounts();
     
    //   console.log('Sending from Metamask account: ' + accounts[0]);

    //   //obtain contract address from storehash.js
    //   const ethAddress= await storehash.options.address;
    //   this.setState({ethAddress});

    //   //save document to IPFS,return its hash#, and set hash# to state
    //   //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
    //   await ipfs.add(this.state.buffer, (err, ipfsHash) => {
    //     console.log(err,ipfsHash);
    //     //setState by setting ipfsHash to ipfsHash[0].hash 
    //     this.setState({ ipfsHash:ipfsHash[0].hash });

    //     // call Ethereum contract method "sendHash" and .send IPFS hash to etheruem contract 
    //     //return the transaction hash from the ethereum contract
    //     //see, this https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send
        
    //     storehash.methods.sendHash(this.state.ipfsHash).send({
    //       from: accounts[0] 
    //     }, (error, transactionHash) => {
    //       console.log(transactionHash);
    //       this.setState({transactionHash});
    //     }); //storehash 
    //   }) //await ipfs.add 
    // }; //onSubmit 
  
    render() {    
      return (
        <p>Hello : {this.state.account}</p>
      );
    } 
}

export default App;