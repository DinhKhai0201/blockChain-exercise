pragma solidity >=0.4.22 <0.6.0;
//0xb96601336791f506c23b90e73086d57b85e6f52f
contract KhaiToken {
    string public name;
    string public symbol;
    uint8 public decimals;
    
    mapping (address => uint) public balanceOf;
    mapping (address => mapping (address => uint)) public allowance;
    
    function transfer(address _to, uint _value) public returns (bool success) {
        require(_value > 0);
        require(_to != address(0x0));
        require(balanceOf[msg.sender] >= _value);
        require(balanceOf[_to] + _value >= balanceOf[_to]);
        uint previousBalances = balanceOf[msg.sender] + balanceOf[_to];
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        assert(balanceOf[msg.sender] + balanceOf[_to] == previousBalances);
        return true;
    }
    function transferFrom(address _from, address _to, uint _value) public  returns (bool success) {
        require(_value > 0);
        require(_to != address(0x0));
        require(balanceOf[_from] >= _value);
        require(balanceOf[_to] + _value >= balanceOf[_to]);
        balanceOf[_from] -= _value;
        allowance[_from][msg.sender] -= _value;
        balanceOf[_to] += _value;
        return true;
    }
    
    function balanceOf(address _owner) public constant returns (uint balance) {
        return balanceOf[_owner];
    }
    
     function approve(address _spender, uint _value) public
        returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        return true;
    }
}
contract Khai is KhaiToken {
    uint public totalSupply;
    address public fundsWallet; 
    uint public initialSupply;
    
    constructor() public {
        name = "Khai";                            
        decimals = 18;                                             
        symbol = "K"; 
        initialSupply = 1000; 
        fundsWallet = msg.sender;
        totalSupply = initialSupply * 10 ** uint(decimals); 
        balanceOf[msg.sender] = totalSupply;                
    }
    
    function increase() public  {
        require(msg.sender==fundsWallet);
        balanceOf[msg.sender] = balanceOf[msg.sender]+totalSupply*10/100;
        totalSupply = totalSupply +totalSupply*10/100;
    }
}
