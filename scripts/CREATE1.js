const { call } = require("@openzeppelin/upgrades-core");
const {ethers} = require("hardhat");

async function main(){

    const [signer, other] = await ethers.getSigners();
    const signerAddress = await signer.getAddress();
    const nonce = 10;

    const AccountFactory = await ethers.getContractFactory("contracts/create1.sol:AccountFactory");
    const accountFactory = await AccountFactory.deploy();
    await accountFactory.waitForDeployment();

    const factoryAddress = await accountFactory.getAddress();
    console.log("Factory address: ", factoryAddress);

    const address = await accountFactory.createAccount(signerAddress);
    await address.wait();
    console.log("Address: ",  address.data);

    //NOW WE DO CREATE

    const sender = await hre.ethers.getCreateAddress({
    from: factoryAddress,
    nonce: address.nonce
  })

  console.log(" created address: ",  sender);

    // const address1 = "0x" + address.toString() + 10;
    // console.log("Address: ",  address1);


}

main().catch(console.error)