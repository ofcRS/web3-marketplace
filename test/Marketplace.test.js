const Marketplace = artifacts.require('./Marketplace.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Marketplace', ([deployer, seller, buyer]) => {
  let marketplace;

  before(async () => {
    marketplace = await Marketplace.deployed();
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await marketplace.address;
      assert.equal(false, [0x0, '', null, undefined].includes(address));
    })

    it('has a name', async () => {
      const name = await marketplace.name();
      assert.equal(name, 'Web3 Marketplace')
    })
  })

  describe('products', async () => {
    let result, productCount;

    before(async () => {
      result = await marketplace.createProduct('smartphone', web3.utils.toWei('1', 'Ether'), { from: seller })
      productCount = await marketplace.productCount()
    })

    it('creates products', async () => {
      assert.equal(productCount, 1);
      const event = result.logs[0].args;

      assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
      assert.equal(event.name, 'smartphone', 'name is correct')
      assert.equal(event.price, '1000000000000000000', 'price is correct')
      assert.equal(event.owner, seller, 'owner is correct')
      assert.equal(event.purchased, false, 'purchased is correct')

      await marketplace.createProduct('', web3.utils.toWei('1', 'Ether'), { from: seller }).should.be.rejected;
      await marketplace.createProduct('smartphone', 0, { from: seller }).should.be.rejected;
    })

    it('sells products', async () => {
      const oldSellerBalance = new web3.utils.BN(await web3.eth.getBalance(seller));

      result = await marketplace.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('1', 'Ether') });

      const event = result.logs[0].args;

      assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
      assert.equal(event.name, 'smartphone', 'name is correct')
      assert.equal(event.price, '1000000000000000000', 'price is correct')
      assert.equal(event.owner, buyer, 'owner is correct')
      assert.equal(event.purchased, true, 'purchased is correct')

      const newSellerBalance = new web3.utils.BN(await web3.eth.getBalance(seller));

      const price = new web3.utils.BN(web3.utils.toWei('1', 'Ether'));

      const expectedBalance = oldSellerBalance.add(price);
      assert.equal(newSellerBalance.toString(), expectedBalance.toString(), 'Updated seller balance is correct');

      await marketplace.purchaseProduct(99, { from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
      await marketplace.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('0.5', 'Ether') }).should.be.rejected;
      await marketplace.purchaseProduct(productCount, { from: deployer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
      await marketplace.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
    })
  })
})