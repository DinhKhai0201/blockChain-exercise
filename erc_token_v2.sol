pragma solidity >=0.4.22 <0.6.0;

contract StandardToken {
    function transfer(address _to, uint256 _value) public returns (bool success) {
        if (balances[msg.sender] >= _value && _value > 0) {
            balances[msg.sender] -= _value;
            balances[_to] += _value;
            return true;
        } else { return false; }
    }
    function transferFrom(address _from, address _to, uint256 _value) public  returns (bool success) {
        if (balances[_from] >= _value && allowed[_from][msg.sender] >= _value && _value > 0) {
            balances[_to] += _value;
            balances[_from] -= _value;
            allowed[_from][msg.sender] -= _value;
            return true;
        } else { return false; }
    }

    function balanceOf(address _owner) public constant returns (uint256 balance) {
        return balances[_owner];
    }
    function approve(address _spender, uint256 _value) public  returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        return true;
    }
    function allowance(address _owner, address _spender) public constant returns (uint256 remaining) {
      return allowed[_owner][_spender];
    }
    mapping (address => uint256) balances;
    mapping (address => mapping (address => uint256)) allowed;
    uint256 public totalSupply;
}

contract Khai  is StandardToken { 
    string public name;                  
    uint8 public decimals;               
    string public symbol;                
    string public version = 'v1.0';
    uint256 public unitsOneEthCanBuy;     
    uint256 public totalEthInWei;        
    address public fundsWallet;   
    
    constructor () public {
        balances[msg.sender] = 1000000000000000000000;              
        totalSupply = 1000000000000000000000;                     
        name = "Khai";                                  
        decimals = 18;                                             
        symbol = "khaiTC";                                           
        unitsOneEthCanBuy = 10;                                   
        fundsWallet = msg.sender;                                 
    }
    function increase() public  {
        require(msg.sender==fundsWallet);
        balances[msg.sender] = balances[msg.sender]+totalSupply*10/100;
        totalSupply = totalSupply +totalSupply*10/100;
    }
}
