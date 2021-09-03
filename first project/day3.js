 
 const SHA256 = require('crypto-js/sha256');
 

 // how transaction will look like
 
     class Transaction{
         constructor(fromaddress,toaddress, amount){
             this.toaddress=toaddress;
             this.fromaddress=fromaddress;
             this.amount=amount;
         }
 
     }
 
 
 //  class block is for how blockchain will look like ,what properties it should have :)
 class Block{
     constructor( timestamp, transactions, previousHash =''){
     
      this.timestamp=timestamp;
      this.transactions=transactions;
      this.previousHash=previousHash;
      this.hash = this.calculateHash();
      this.nonce=0;
     }
    
     calculateHash(){
         // hehe tostring is used to casting result of sha256 into string;
       return SHA256(this.timestamp + this.previousHash + JSON.stringify(this.transactions)+this.nonce).toString();
     }
     // difficluty here means how many zeros we want to in our hash code 
     mineBlock(difficulty){
 
         while(this.hash.substring(0,difficulty)!==Array(difficulty+1).join("0")){
             this.nonce++;
             this.hash=this.calculateHash();
 
         }
         console.log("block mined:" +this.hash);
 
     }
 
 }
 
    class Blockchain {
        constructor(){
            this.chain=[this.createGenesisBlock()];
            this.difficulty=2;
            this.pendingTransactions=[];
            this.miningReward=100;
        }
 
     //    as first block is genesis block ...so ahould be added manually
 
       createGenesisBlock(){
       return new Block('21/08/2021',"Genesis block","0");
       }
      
     //   this will return last element of chain (that was a array)
       getLatestBlock(){
          return this.chain[ this.chain.length-1];
     }
 
 
     // ye tricky h dimag lagao
     // 1st previous hash set krna padega mtlb last block ka hash lana padega by using getlatestblock().hash;
     // ab nye block ka hash calculate krna padega using calculateHash
     // then push it into the chain
     //  addBlock(newBlock){
     //      newBlock.previousHash=this.getLatestBlock().hash;
     //      newBlock.mineBlock(this.difficulty);
     //     this.chain.push(newBlock);
     //  }
     //  but reality me itna easy nhi h nya block add krna kaafi checks and verification hota h saala
 // this is new addblock
        minePendingTransactions(miningRewardAddress){
            let block = new Block(Date.now(),this.pendingTransactions);
         //    in reality miner have to choose the transaction that they wants to include
 
            block.mineBlock(this.difficulty);
 
            console.log("block successfully mined");
         //    now we r going to add that in our chain
            this.chain.push(block);
 
         //    mow we have give miner reward for mining block
           
         this.pendingTransactions=[
             new Transaction(null,miningRewardAddress,this.miningReward)
         ];
        }
   
     //    this will recieve transaction then push it to pending trarnction
 
          createTransaction(transaction){
              this.pendingTransactions.push(transaction);
          }  
          
         //  balance check
         getBalanceOfAddress(address){
             let balance=0;
             // loop over all blocks bcz in reality we dont have a balance it block thing
             for( const block of this.chain){
                 for(const trans of block.transactions){
                       if(trans.fromaddress===address){
                         //   to paise gya h jeb se isilye minus hoga
                         balance -=trans.amount;
                       } 
                        if(trans.toaddress===address){
                            balance+=trans.amount;
                        }
                 }
             }
             return balance;
         }
        
 
     //   valid chain for this ---loop on entire chain loop start with 1 bcz 0 block was genesis block
       isChainValid(){
           for( let i=1; i<this.chain.length;i++){
               const currentBlock=this.chain[i];
               const previousBlock= this.chain[i-1];
     // 1st thing we check if the hash of the block is valid or not
                 if(currentBlock.hash!==currentBlock.calculateHash()){
                     return false;
                 }
 //    next xhexhk is we need to check prev hash property
                 if(currentBlock.previousHash !==previousBlock.hash){
                     return false;
                 }
           }
           return true;
       }
    }  
 // we dont want people to make 1000s of block every sec so we are going to add some diffculty called proof of work or mining 
 
    let mycoin= new Blockchain();
 
 //    console.log('mining block 1...');
 
 //    mycoin.addBlock(new Block(1,"10/07/2021",{amount:4 }));
 
 
 //    console.log('mining block 2:')
 //     mycoin.addBlock(new Block(2,"11/07/2021",{amount:10}));
 
 
 //     console.log("is blockchain valid?:"+ mycoin.isChainValid())
 // //    console.log(JSON.stringify(mycoin,null,4));
 mycoin.createTransaction(new Transaction("address1","address2",100));
 mycoin.createTransaction(new Transaction("address2","address1",50));
 
 console.log('\n starting the mienr....');
 mycoin.minePendingTransactions("miners address");
 console.log('\n balance of me is',mycoin.getBalanceOfAddress("miners address"));
 
 console.log('\n starting the mienr again....');
 mycoin.minePendingTransactions("miners address");
 console.log('\n balance of me is',mycoin.getBalanceOfAddress("miners address"));