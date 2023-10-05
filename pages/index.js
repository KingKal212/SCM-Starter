import {useState, useEffect} from "react";
import {ethers} from "ethers";
import abi from "./contract/abi.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);

  const [contract, setContract] = useState(undefined);
  const [tally, setTally] = useState(undefined);


  const contractAddress = "0x326592C60A7a2A23a1668D2FE9a7F81Fc7Ba9D56";

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getContract();
  };

  const getContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const tally = new ethers.Contract(contractAddress, abi, signer);
 
    setContract(tally);
  }

  const getTally = async() => {
    if (contract) {
      setTally((await contract.tally()).toNumber());
    }
  }

  const addToTally = async() => {
    if (contract) {
      let tx = await contract.addTally();
      await tx.wait()
      getTally();
    }
  }

  const removeFromTally = async() => {
    if (contract) {
      let tx = await contract.removeTally();
      await tx.wait()
      getTally();
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (tally == undefined) {
      getTally();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your current Tally: {tally}</p>
        <hr></hr>
        <button onClick={addToTally}> add To Tally </button>
        <button onClick={removeFromTally}> remove from Tally </button>
        <hr></hr>
        


      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Tally Dapp!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
}
