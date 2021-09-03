
// we dont want people to make 1000s of block every sec so we are going to add some diffculty called proof of work or mining 


const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const{Blockchain,Transaction}=require('./blockchain');

const myKey =ec.keyFromPrivate('f490b1d861a00e4b960987871306d2f2eaa2f83257bc8948397b487ea9549075');
const myWalletaddress = myKey.getPublic('hex');


   let mycoin= new Blockchain();


  

  const tx1 = new Transaction(myWalletaddress, 'address2',50);
  tx1.signTransaction(myKey);
  mycoin.addTransaction(tx1);

//   mine block
   mycoin.minePendingTransactions(myWalletaddress); //this will add 100 coins in my wallet

   tx2=new Transaction(myWalletaddress,'address1',50);// this will deduct 50 coins from my wallet
   tx2.signTransaction(myKey);
   mycoin.addTransaction(tx2);

//    mine 2nd blcok
  mycoin.minePendingTransactions(myWalletaddress);//again this will add 100 or say mining reward to my wallet

  console.log();
  console.log(`Balance of mywallet is ${mycoin.getBalanceOfAddress(myWalletaddress)}`);

  console.log();

  console.log('Blockchain valid?', mycoin.isChainValid() ? 'YES':'NO');



