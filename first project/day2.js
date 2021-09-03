 
 const SHA256 = require('crypto-js/sha256');

 //  class block is for how blockchain will look like ,what properties it should have :)
 class Block{
     constructor(index, timestamp, data, previousHash =''){
      this.index=index;
      this.timestamp=timestamp;
      this.data=data;
      this.previousHash=previousHash;
      this.hash = this.calculateHash();
      this.nonce=0;
     }
    
     calculateHash(){
         // hehe tostring is used to casting result of sha256 into string;
       return SHA256(this.index+this.timestamp + this.previousHash + JSON.stringify(this.data)+this.nonce).toString();
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
        }
 
     //    as first block is genesis block ...so ahould be added manually
 
       createGenesisBlock(){
       return new Block(0,'21/08/2021',"Genesis block","0");
       }
      
     //   this will return last element of chain (that was a array)
       getLatestBlock(){
          return this.chain[ this.chain.length-1];
     }
 
 
     // ye tricky h dimag lagao
     // 1st previous hash set krna padega mtlb last block ka hash lana padega by using getlatestblock().hash;
     // ab nye block ka hash calculate krna padega using calculateHash
     // then push it into the chain
      addBlock(newBlock){
          newBlock.previousHash=this.getLatestBlock().hash;
          newBlock.mineBlock(this.difficulty);
         this.chain.push(newBlock);
      }
     //  but reality me itna easy nhi h nya block add krna kaafi checks and verification hota h saala
 
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
 
    console.log('mining block 1...');
 
    mycoin.addBlock(new Block(1,"10/07/2021",{amount:4 }));
 
 
    console.log('mining block 2:')
     mycoin.addBlock(new Block(2,"11/07/2021",{amount:10}));
 
 
 //     console.log("is blockchain valid?:"+ mycoin.isChainValid())
 // //    console.log(JSON.stringify(mycoin,null,4));
 