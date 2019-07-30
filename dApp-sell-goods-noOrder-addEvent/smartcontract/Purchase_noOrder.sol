pragma solidity >=0.4.22 <0.6.0;

import "./coin-erc20.sol";
contract Purchase is ErcToken{
    
    //struct of good
    using SafeMath for uint;
    address payable public ownerToten;
	struct Goods {
	    uint id; 
        address payable owner;
        string nameGoods;
        uint priceErc; //in wei 
        uint priceEth;// in erc
        State state;
        bool paytype; //true la erc, false la ether
    }

    Goods[] public goods;  // a array struct of goods 
    mapping (address => bool) public users;

    enum State {
        noOrder,
        fail, 
        buyerSendOrder,
        sellerAcceptOrder,
        completedOrder
    } 
    
    event RegisterUser(address indexed _user, bool _check);
    event AddGoods(address indexed _user, uint _idGoods, string _nameGood,  uint _priceEth, uint _priceErc, State state, bool _paytype);
    event UpdateGoods(address indexed _user, uint indexed _idGoods, string _nameGood, uint _priceEth, uint _priceErc, State state);
    event BuyerSendOrder(address indexed _buyer, address indexed _seller,  uint indexed _idGoods, string _nameGood, uint _priceEth, uint _priceErc, State state );
    event SellerAcceptOrder(address indexed _seller, uint indexed _idGoods, string _nameGood);
    event CompletedOrder(address indexed _buyer, address indexed _seller, bool _accept, uint indexed _idGoods, string _nameGood, uint _priceEth, uint _priceErc, State state, bool _paytype );
    
    constructor () public  {
        ownerToten = msg.sender;
    }
    
    // function check user register or not yet
    function checkRegister() 
        view  
        public 
        returns(bool) 
    { 
        if (users[msg.sender]) {
             return true;
        } else {
            return false;
        }
    }
    
    // function user register
    function registerUser() 
        public  
    {
        require(checkRegister() == false,"You are register");
        users[msg.sender] = true;
        emit RegisterUser(msg.sender, true);
    }
    
    /*function return detail of the goods
    *@param _id is id of goods you want to detal of goods
    */
    function detailGood( uint _id) 
        view 
        public 
        returns (uint, address, string memory, uint ,uint, State, bool) 
    {
        Goods memory _good = goods[_id - 1];
        return (_id, _good.owner,  _good.nameGoods, _good.priceErc, _good.priceErc, _good.state, _good.paytype);
    } 
    
    /*function add good
    *@param _nameGood is name of goods user want to set
    *@param _price is is price of goods user want to set
    */ 
    function addGoods (
    	string memory _nameGood,
    	uint _price
    )
        public 
    {
        require(users[msg.sender] == true, "you must register");
        goods.push(Goods(goods.length + 1, msg.sender, _nameGood, _price, _price, State.noOrder ,true));
        // ben UI dung de hien thi nhung mac hang ma 1 nguoi nao do da va dang ban, xet status la 4 thi hien thi da ban 
        emit AddGoods(msg.sender, goods.length, _nameGood,  _price, _price, State.noOrder ,true);
    }
    
    /*function update good
    *@param _id is id of goods user want to update
    *@param _nameGood is new name
    *@param _price is new price
    *@param _status is new status (true have not  bought yet, false was bought )
    */
    function updateGoods(
        uint _id, 
        string memory _nameGood,
        uint _price, 
        State _state
    ) 
        public
    {
        Goods storage _good = goods[_id - 1];
        require(_good.owner == msg.sender);
        require(_good.state == State.noOrder); //khi hang chua duoc ban
        _good.nameGoods = _nameGood;
        _good.priceErc = _price;
        _good.priceEth = _price;
        _good.state = _state;
        emit UpdateGoods(msg.sender, _id, _nameGood, _price, _price, _state);
    }
    
    //function return sum all of goods
    function sumOfGoods() 
        view 
        public 
        returns(uint) 
    {
        return goods.length;
    }
    
    /*step 1 buyer send a order with price is erc token 20
    *@param _id is id of goods buyer want to buy
    *@param _ercCoin is amount token to buy goods
    */ 
    function buyerSendOrderErc(
        uint _id,
        uint _ercCoin
    ) 
        payable 
        public 
    {
        Goods storage _good = goods[_id - 1];
        require(_good.state == State.noOrder);
        require(msg.sender != _good.owner);
        require(_ercCoin <= balanceOf[msg.sender]);
        require(_good.priceErc ==  _ercCoin);
        require(msg.value ==  0);
        balanceOf[msg.sender] = balanceOf[msg.sender] - _ercCoin;
        _good.state = State.buyerSendOrder;
        emit BuyerSendOrder(msg.sender, _good.owner, _id, _good.nameGoods, 0, _ercCoin,State.buyerSendOrder);
    }
    
    /* or  step 1 buyer send a order with price is ether
    *@param _id is id of goods buyer want to buy
    *@param _amount is amount ether to buy goods
    */
    function buyerSendOrderEth(
        uint _id,
        uint _amount
    ) 
        payable 
        public 
    {
        Goods storage _good = goods[_id - 1];
        require(_good.state == State.noOrder);
        require(msg.sender != _good.owner);
        require(_amount == msg.value);
        require(_good.priceEth == (msg.value));
        _good.paytype = false;
        emit BuyerSendOrder(msg.sender,  _good.owner,_id, _good.nameGoods, msg.value, 0, State.buyerSendOrder);
    }
    
    /* step 2 : seller accep order or not 
    *@param _idOrder is id of order seller want to handle
    *@param _accept is seller want to accept or not
    */
    function sellerAcceptOrder(
        uint _idGoods
    ) 
        public 
    {
        Goods storage _good = goods[_idGoods - 1];
        require(_good.state == State.buyerSendOrder);
        require(_good.owner == msg.sender);
        _good.state = State.sellerAcceptOrder;  
        emit SellerAcceptOrder(msg.sender, _idGoods, _good.nameGoods);
    }
    
    /* step 3 : buyer accept receive  or not
    *@param _idOrder is id of order buyer want to handle
    *@param _accept is buyer  accept or not
    */
    function completedOrder(
        uint _idGoods,
        bool _accept
    ) 
        public
    {

        Goods storage _good = goods[_idGoods - 1];
        require(_good.state == State.sellerAcceptOrder);
        require(_good.owner != msg.sender);
        if(_accept){
            /* when buyer accept , 90% of price will transfer to seller,
            *  10% of price will be transfer to contract creator
            */
            if ( _good.paytype == false) {
                _good.owner.transfer(_good.priceEth*90/100);
                ownerToten.transfer(_good.priceEth *10/100);
            } else {
                balanceOf[_good.owner] = balanceOf[_good.owner].add(_good.priceErc*90/100);
                balanceOf[ownerToten] = balanceOf[ownerToten].add(_good.priceErc*10/100);
            }
            _good.owner = msg.sender;
            _good.state = State.completedOrder;
            emit CompletedOrder(msg.sender, _good.owner, true, _idGoods, _good.nameGoods, _good.priceErc, _good.priceEth, State.completedOrder, _good.paytype);
        }
        else {
            /* when buyer don't accept , 80% of price will transfer to buyer,
            *  10% of price will be transfer to contract creator
            *  10% of price will be transfer to seller
            */
            if ( _good.paytype == false) {
                _good.owner.transfer(_good.priceEth *35/100);
                msg.sender.transfer(_good.priceEth *60/100);
                ownerToten.transfer(_good.priceEth *5/100);
            } else {
                balanceOf[_good.owner] = balanceOf[_good.owner].add(_good.priceErc*35/100);
                balanceOf[msg.sender] = balanceOf[msg.sender].add(_good.priceErc*60/100);
                balanceOf[ownerToten] = balanceOf[ownerToten].add(_good.priceErc*5/100);
            }
            _good.state = State.noOrder;  
            emit CompletedOrder(msg.sender, _good.owner, false, _idGoods,  _good.nameGoods, _good.priceErc, _good.priceEth, State.completedOrder, _good.paytype);
        }
    }
}

