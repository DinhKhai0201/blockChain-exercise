pragma solidity >=0.4.22 <0.6.0;
// 0x27720d47eef00b750b2a735a6e9f4b0f97927eb5

import "./erc_token_v2.sol";
contract Purchase is Khai{
    string public contractName = "Mua bán các loại mặc hàng mà bạn yêu thích .";
    
	struct Goods {
	    uint id;
        address owner;
        string nameGoods;
        uint price;
        bool status;
    }
    struct Orders {
        uint orderId;
        uint goodId;
        address buyer;
        uint priceErc;
        uint priceEth;
        bool status;
    }
    Goods[] public goodss;
    Orders[] public orders;
    mapping (address => bool) public users;
    mapping(address => Goods[]) public goodsAdr;
    enum State {
        newOrder,
        buyerSendOrder,
        sellerAccept,
        completed
    } 
    State public state;
    
    constructor () public payable {

    }

    function setExist() view  public returns(bool) { 
        if (users[msg.sender]) {
             return true;
        } else {
            return false;
        }
    }
    function Login() public returns(bool) {
        require(setExist() == false,"You are login");
        users[msg.sender] = true;
    }
    function sumOwnerGoods() view public returns (uint) {
        return goodsAdr[msg.sender].length;
    } 
    function DetailGood( uint _id) view public returns (uint, address, string, uint, bool) {
        
        return (_id, goodss[_id -1 ].owner, goodss[_id -1 ].nameGoods, goodss[_id - 1 ].price, goodss[_id -1 ].status);
        
    } 
    function addGoods (
    	string memory _nameGood,
    	uint _price
    )
    public 
    returns (bool success)
    {
        require(users[msg.sender] == true,"you are not login");
        goodss.push(Goods(goodss.length + 1, msg.sender, _nameGood,_price, true ));
        goodsAdr[msg.sender].push(Goods(goodss.length + 1, msg.sender, _nameGood, _price,true ));
        return true;
    }
    function updateGoods(uint _id, string memory _nameGood,uint _price, bool _status) public{
        require(goodss[_id - 1].owner == msg.sender);
        goodss[_id - 1].nameGoods =_nameGood;
        goodss[_id - 1].price =_price;
        goodss[_id - 1].status =_status;
    }
     function sumOfGoods() view public returns(uint) {
        return goodss.length;
    }

    function buyerSendOrder(uint _id ,uint Khai) payable public {
        require(goodss[_id - 1].status);
        require(msg.sender != goodss[_id - 1].owner);
        require(Khai <= balanceOf[msg.sender]);
        uint _price = goodss[_id - 1].price;
        require(_price == (msg.value + Khai));
        balanceOf[msg.sender] = balanceOf[msg.sender] - Khai;
        orders.push(Orders(orders.length + 1, _id, msg.sender, Khai, msg.value,false));
        goodss[_id - 1].status = false;
        state = State.buyerSendOrder;
    }
    function sellerAccept(uint _idOrder, bool _accept)  public {
        Orders storage _order = orders[_idOrder];
        Goods storage _good = goodss[_order.goodId - 1];
        require(state == State.buyerSendOrder);
        require(_good.owner == msg.sender);
        if(!_accept){
            _order.buyer.transfer(_order.priceEth);
            balanceOf[_order.buyer] = balanceOf[_order.buyer] + _order.priceErc;
            state = State.completed;  
            goodss[_good.id - 1].status = true;
            
        }
        else{
            state = State.sellerAccept;  
        }
    }
    function Completed(uint _idOrder,bool _accept) payable public{
        Orders storage _order = orders[_idOrder];
        require(state == State.sellerAccept);
        require(_order.buyer == msg.sender);
        Goods storage _good = goodss[_order.goodId-1];
        if(_accept){
            _good.owner.transfer(_order.priceEth*90/100);
            balanceOf[_good.owner] = balanceOf[_good.owner] + _order.priceErc*90/100;
            fundsWallet.transfer(_order.priceEth *10/100);
            balanceOf[fundsWallet] = balanceOf[fundsWallet] + _order.priceErc*10/100;
            goodss[_good.id - 1].owner = msg.sender;
            orders[_idOrder].status = true;
            
        }
        else{
            _good.owner.transfer(_order.priceEth *10/100);
            balanceOf[_good.owner] = balanceOf[_good.owner] + _order.priceErc*10/100;
             _order.buyer.transfer(_order.priceEth *80/100);
            balanceOf[_order.buyer] = balanceOf[_order.buyer] + _order.priceErc*80/100;
            fundsWallet.transfer(_order.priceEth *10/100);
            balanceOf[fundsWallet] = balanceOf[fundsWallet] + _order.priceErc*10/100;
        }
        state = State.completed;
    }
    
}
