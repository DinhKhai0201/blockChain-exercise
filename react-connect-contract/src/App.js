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
        txReceipt: '',
        url:'' ,
        contracts: null,
        web3 : null  
      } 
    }
    componentDidMount(){
      const ipfs = (contracts, web3) => {
        this.setState({
           contracts, web3
        })
        let that = this;
         contracts.methods.ipfsHash().call({},function(err, result) {
          that.setState({ipfsHash: web3.utils.sha3(result)})
        })
          web3.eth.getCoinbase(function(err, result) {
          that.setState({account: result})
        })
      }
      getContract(ipfs);
      // const account = (contracts, web3) => {
      //   let that = this;

      //    web3.eth.getCoinbase(function(err, result) {
      //     that.setState({account: result})
      //   })
      // }
      // getContract(account);
    }
    captureFile =(event) => {
      event.stopPropagation()
      event.preventDefault()
      const file = event.target.files[0]
      let reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => this.convertToBuffer(reader)    
    };

    convertToBuffer = async(reader) => {
      //file is converted to a buffer to prepare for uploading to IPFS
        const buffer = await Buffer.from(reader.result);
      //set this buffer -using es6 syntax
        this.setState({buffer});
    };

    onSubmit = async (event) => {
      event.preventDefault();
      //save document to IPFS,return its hash#, and set hash# to state
      //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
      await ipfs.add(this.state.buffer, (err, ipfsHash) => {
        console.log(err,ipfsHash);
        //setState by setting ipfsHash to ipfsHash[0].hash 
        this.setState({ url:'https://gateway.ipfs.io/ipfs/' +ipfsHash[0].hash });
        this.setState({ ipfsHash:ipfsHash[0].hash });

        // call Ethereum contract method "sendHash" and .send IPFS hash to etheruem contract 
        //return the transaction hash from the ethereum contract
        //see, this https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send
        const sendHash = (contracts, web3) => {
            let that = this;
             contracts.methods.sendHash(this.state.ipfsHash).send({
                from: this.state.account 
             },function(err, transactionHash) {
             console.log(transactionHash);
             that.setState({transactionHash: transactionHash});
            })
          }
        getContract(sendHash);
      }) //await ipfs.add 
    }; //onSubmit 
    //https://gateway.ipfs.io/ipfs/your IPFS hash
    render() {    
      return (
        <div className="App">                 
                <h3> Choose file to send to IPFS </h3>          
                <Form onSubmit={this.onSubmit}>            
                <input type = "file" onChange = {this.captureFile}/>             
                <Button type="submit">Send it</Button>          
                </Form>
                <Table >
                    <thead>                  
                        <tr>                    
                            <th>Tx Receipt Category</th>                    
                            <th> </th>                    
                            <th>Values</th>                  
                        </tr>                
                    </thead>
                    <tbody>                  
                        <tr>                    
                        <td>IPFS Hash stored on Ethereum</td>                    
                        <td> : </td>                    
                        <td>
                        {this.state.url}
                        </td>                  
                        </tr>                                  
                        <tr>                    
                        <td>Tx # </td>                    
                        <td> : </td>                    
                        <td>{this.state.transactionHash}</td>                  
                        </tr>                
                    </tbody>            
                </Table>          
        </div> 
      );
    } 
}

export default App;