const { keccak256 } = require("ethers");
const {ethers} = require("hardhat");
const { eth } = require("web3");

async function main() {
    // Get signers
    const [deployer, next_signer] = await ethers.getSigners();
    const deployer_address = await deployer.getAddress();

    // Deploy account factory
    const AccFactoryFactory = await ethers.getContractFactory("contracts/Account.sol:AccountFactory");
    const accFactory = await AccFactoryFactory.deploy();

    await accFactory.waitForDeployment();
    const accFactoryAddress = await accFactory.getAddress();

    console.log("SUccessfully deployed the Account Factory at address: ", accFactoryAddress);

    // // Create an account before using EXECUTE!
    // const InitinitCode = await accFactory.createAccount(deployer_address);
    // await InitinitCode.wait();

    // console.log("Initial initCode w/out Factory Address: ", InitinitCode.data);

    // // Form final Initcode
    // const InitCode = accFactoryAddress + InitinitCode.data.slice(2);

    // console.log("Final initCode: ", InitCode);

    // // Deploy EntryPoint to get sender address!
    // const EntryPointFactory = await ethers.getContractFactory("EntryPoint");
    // const entrypoint = await EntryPointFactory.deploy();
    // await entrypoint.waitForDeployment();

    

    // let sender_address
    // // Use try catch with the guaranteed revert form function
    // try {
    //     await entrypoint.getSenderAddress(InitCode);
    // } catch (sender){
    //     const sender_address = "0x" + sender.data.data.slice(-40);
    //     console.log("SCA address is: ", sender_address);
    // }

    const Account_Factory = await ethers.getContractFactory("contracts/Account.sol:Account");

    // We now have access to execute!
    const callData = Account_Factory.interface.encodeFunctionData("execute", [5]);
    console.log(callData);

    console.log("DONE!");
    // const tx = await accFactory.connect(sender_address).execute();
    // await tx.wait();

} main().catch(console.error)