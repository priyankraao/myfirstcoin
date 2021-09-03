
const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


// how transaction will look like

class Transaction {
    constructor(fromaddress, toaddress, amount) {
        this.toaddress = toaddress;
        this.fromaddress = fromaddress;
        this.amount = amount;
        this.timestamp=Date.now();
    }
    calculateHash() {
        return SHA256(this.fromaddress + this.toaddress + this.amount).toString();

    }

    signTransaction(signingKey) {
        if (signingKey.getPublic('hex') !== this.fromaddress) {
            throw new Error('you cannot sign transactions for other wallets!');

        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');

        this.signature = sig.toDER('hex');

    }

    isValid() {
        if (this.fromaddress === null) return true;

        if (!this.signature || this.signature.length === 0) {
            throw new Error('no signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromaddress, 'hex');  //we are make public key from fromaddress
        return publicKey.verify(this.calculateHash(), this.signature);
    }

}


//  class block is for how blockchain will look like ,what properties it should have :)
class Block {
    constructor(timestamp, transactions, previousHash = '') {

        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        // hehe tostring is used to casting result of sha256 into string;
        return SHA256(this.timestamp + this.previousHash + JSON.stringify(this.transactions) + this.nonce).toString();
    }
    // difficluty here means how many zeros we want to in our hash code 
    mineBlock(difficulty) {

        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();

        }
        console.log("block mined:" + this.hash);

    }

    hasValidTransactions() {
        for (const tx of this.transactions) {
            if (!tx.isValid()) {
                return false;
            }

        }
        return true;
    }

}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 1200;
    }

    //    as first block is genesis block ...so ahould be added manually

    createGenesisBlock() {
        return new Block(Date.parse('2021-25-08'), [], "0");
    }

    //   this will return last element of chain (that was a array)
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
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
    minePendingTransactions(miningRewardAddress) {
       const rewardTx= new Transaction(null,miningRewardAddress,this.miningReward);
       this.pendingTransactions.push(rewardTx);

       const block= new Block(Date.now(),this.pendingTransactions,this.getLatestBlock().hash);
       block.mineBlock(this.difficulty);

       console.log('block successfully mined');

       this.chain.push(block);

       this.pendingTransactions=[];
    }

    //    this will recieve transaction then push it to pending trarnction

    addTransaction(transaction) {

        if (!transaction.fromaddress || !transaction.toaddress) {
            throw new Error('transaction must include from and to address');
        }
        if (!transaction.isValid()){
            throw new Error('cannot add invalid transaaction to chain');
        }
        if(transaction.amount<=0){
            throw new Error('cannot add invalid transaaction to chain');
        }
        if(this.getBalanceOfAddress(Transaction.fromaddress)<Transaction.amount){
            throw new Error('cannot add invalid transaaction to chain');
        }

        this.pendingTransactions.push(transaction);
    }

    //  balance check
    getBalanceOfAddress(address) {
        let balance = 0;
        // loop over all blocks bcz in reality we dont have a balance it block thing
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromaddress === address) {
                    //   to paise gya h jeb se isilye minus hoga
                    balance -= trans.amount;
                }
                if (trans.toaddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }


    getAllTransactionsFromWallet(address){
        const txs =[];
        for(const block of this.chain){
            for(const tx of block.transactions){
                if(tx.fromaddress===address || tx.toaddress===address){
                    txs.push(tx);
                }
            }
        }
          return txs;
    }

    //   valid chain for this ---loop on entire chain loop start with 1 bcz 0 block was genesis block
    isChainValid() {
        // check if the geneisis is block is not been tempered with by comparing the output of creategeneisblock and first block

        const realGenesis= JSON.stringify(this.createGenesisBlock());

        if((realGenesis)!==JSON.stringify(this.chain[0])){
            return false;
        }
         
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (!currentBlock.hasValidTransactions()) {
                return false;
            }

            // 1st thing we check if the hash of the block is valid or not
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            //    next xhexhk is we need to check prev hash property
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;
module.exports.Block=Block
