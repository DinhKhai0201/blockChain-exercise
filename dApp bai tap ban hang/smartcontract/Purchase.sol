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
        uint price; //in wei or token
        bool status; //true is not  bought yet, false is bought 
    }
    struct Orders {
        uint orderId;
        uint goodId;
        address payable buyer;
        address payable seller;
        uint priceErc;
        uint priceEth;
        State state;  //a logic state
    }
    
    Goods[] public goods;  // a array struct of goods 
    Orders[] public orders;   //a array struct of orders
    
    mapping (address => bool) public users;
    mapping(address => Goods[]) public goodsAdr;
    mapping(address => Orders[]) public ordersAdr;
    // 4 state for buy and sell good
    enum State {
        fail, 
        buyerSendOrder,
        sellerAcceptOrder,
        completedOrder
        
    } 
    
    event RegisterUser(address _user, bool _check);
    event AddGoods(address _user);
    event UpdateGoods(address _user, uint _idGoods);
    event BuyerSendOrder(address _buyer, uint _idGoods, uint _priceEth, uint _priceErc);
    event SellerAcceptOrder(address _seller, bool _accept, uint _idOder);
    event CompletedOrder(address _buyer, bool _accept, uint _idOder);
    
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
    
    /*function return sum of goods of user
    *@param _user is address of user you want to see sum goods of that address
    */ 
    function sumUserGoods(address _user) 
        view 
        public 
        returns (uint) 
    {
        return goodsAdr[_user].length;
    } 
    /*function return sum of orders of user
    *@param _user is address of user you want to see sum orders of that address
    */ 
    function sumUserOrders(address _user) 
        view 
        public 
        returns (uint) 
    {
        return ordersAdr[_user].length;
    }
    /*function return detail of the goods
    *@param _id is id of goods you want to detal of goods
    */
    function detailGood( uint _id) 
        view 
        public 
        returns (uint, address, string memory, uint, bool) 
    {
        Goods memory _good = goods[_id - 1];
        return (_id, _good.owner,  _good.nameGoods, _good.price, _good.status);
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
        goods.push(Goods(goods.length + 1, msg.sender, _nameGood, _price, true ));
        goodsAdr[msg.sender].push(Goods(goods.length, msg.sender, _nameGood, _price, true ));
        emit AddGoods(msg.sender);
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
        bool _status
    ) 
        public
    {
        Goods storage _good = goods[_id - 1];
        require(_good.owner == msg.sender);
        require(_good.status == true);
        _good.nameGoods =_nameGood;
        _good.price =_price;
        _good.status =_status;
        emit UpdateGoods(msg.sender, _id);
    }
    
    //function return sum all of goods
    function sumOfGoods() 
        view 
        public 
        returns(uint) 
    {
        return goods.length;
    }
    
    //function return sum all of order
    function sumOfOrders() 
        view 
        public 
        returns(uint) 
    {
        return orders.length;
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
        require(_good.status);
        require(msg.sender != _good.owner);
        require(_ercCoin <= balanceOf[msg.sender]);
        require(_good.price ==  _ercCoin);
        require(msg.value ==  0);
        balanceOf[msg.sender] = balanceOf[msg.sender] - _ercCoin;
        orders.push(Orders(orders.length + 1, _id, msg.sender, _good.owner, _ercCoin, msg.value, State.buyerSendOrder));
        // ordersAdr[msg.sender].push(Orders(orders.length, _id, msg.sender, _ercCoin, msg.value, State.buyerSendOrder));
        _good.status = false;
        emit BuyerSendOrder(msg.sender, _id, 0, _ercCoin);
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
        require(_good.status);
        require(msg.sender != _good.owner);
        require(_amount == msg.value);
        require(_good.price == (msg.value));
        orders.push(Orders(orders.length + 1, _id, msg.sender, _good.owner,0, msg.value, State.buyerSendOrder));
        _good.status = false;
        emit BuyerSendOrder(msg.sender, _id, msg.value, 0);
    }
    
    /* step 2 : seller accep order or not 
    *@param _idOrder is id of order seller want to handle
    *@param _accept is seller want to accept or not
    */
    function sellerAcceptOrder(
        uint _idOrder,
        bool _accept
    ) 
        public 
    {
        Orders storage _order = orders[_idOrder - 1 ];
        Goods storage _good = goods[_order.goodId - 1];
        require(_order.state == State.buyerSendOrder);
        require(_good.owner == msg.sender);
        if(!_accept){
            _order.buyer.transfer(_order.priceEth);
            balanceOf[_order.buyer] = balanceOf[_order.buyer].add(_order.priceErc);
            _order.state = State.fail;  
            _good.status = true;
            emit SellerAcceptOrder(msg.sender, false, _idOrder);
        }
        else{
            _order.state = State.sellerAcceptOrder;  
            emit SellerAcceptOrder(msg.sender, true, _idOrder);
        }
    }
    
    /* step 3 : buyer accep receive  or not
    *@param _idOrder is id of order buyer want to handle
    *@param _accept is buyer  accept or not
    */
    function completedOrder(
        uint _idOrder,
        bool _accept
    ) 
        public
    {
        Orders storage _order = orders[_idOrder - 1];
        Goods storage _good = goods[_order.goodId - 1];
        require(_order.state == State.sellerAcceptOrder);
        require(_order.buyer == msg.sender);
        if(_accept){
            /* when buyer accept , 90% of price will transfer to seller,
            *  10% of price will be transfer to contract creator
            */
            _good.owner.transfer(_order.priceEth*90/100);
            balanceOf[_good.owner] = balanceOf[_good.owner].add(_order.priceErc*90/100);
            ownerToten.transfer(_order.priceEth *10/100);
            balanceOf[ownerToten] = balanceOf[ownerToten].add(_order.priceErc*10/100);
            _good.owner = msg.sender;
            _order.state = State.completedOrder;
            emit CompletedOrder(msg.sender, true, _idOrder);
        }
        else {
            /* when buyer don't accept , 80% of price will transfer to buyer,
            *  10% of price will be transfer to contract creator
            *  10% of price will be transfer to seller
            */
            _good.owner.transfer(_order.priceEth *10/100);
            balanceOf[_good.owner] = balanceOf[_good.owner].add(_order.priceErc*10/100);
             _order.buyer.transfer(_order.priceEth *80/100);
            balanceOf[_order.buyer] = balanceOf[_order.buyer].add(_order.priceErc*80/100);
            ownerToten.transfer(_order.priceEth *10/100);
            balanceOf[ownerToten] = balanceOf[ownerToten].add(_order.priceErc*10/100);
            _order.state = State.fail;  
            _good.status = true;
            emit CompletedOrder(msg.sender, false, _idOrder);
        }
    }
}
