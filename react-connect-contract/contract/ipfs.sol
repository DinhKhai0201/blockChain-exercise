pragma solidity >=0.4.22 <0.6.0;
contract Contract {
 string public ipfsHash = "hello" ;
 

 function sendHash(string memory  x) public {
  ipfsHash = x;
 }

 function getHash() public view returns (string memory x) {
   return ipfsHash;
 }
}