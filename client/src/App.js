import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import { LineChart, PieChart } from "react-chartkick";
import "chart.js";
import "./App.css";

const GAS = 500000;
const GAS_PRICE = "20000000000";

class App extends Component {
  state = {
    allData: 0,
    data: 0,
    web3: null,
    accounts: null,
    contract: null,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      console.log("web3:", web3);

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  activateLasers = async () => {
    const { contract, web3 } = this.state;
    // Stores a given value, 5 by default.
    //await contract.methods.set(5).send({ from: accounts[0] });
    // Get the value from the contract to prove it worked.
    //const response = await contract.methods.get().call();
    // Update state with the result.
    //this.setState({ storageValue: response });
    const oracleAddress =
      process.env.TRUFFLE_CL_BOX_ORACLE_ADDRESS ||
      "0xc99B3D447826532722E41bc36e644ba3479E4365";
    const jobId =
      process.env.TRUFFLE_CL_BOX_JOB_ID || "3cff0a3524694ff8834bda9cf9c779a1";
    const payment = process.env.TRUFFLE_CL_BOX_PAYMENT || "1000000000000000000";
    const url =
      process.env.TRUFFLE_CL_BOX_URL ||
      "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD";
    const path = process.env.TRUFFLE_CL_BOX_JSON_PATH || "USD";
    const times = process.env.TRUFFLE_CL_BOX_TIMES || "100";
    console.log("CONTRACT: ", contract._address);
    const tx = await contract.methods
      .createRequestTo(
        oracleAddress,
        web3.utils.toHex(jobId),
        payment,
        url,
        path,
        times
      )
      .send({ from: this.state.accounts[0], gas: GAS, gasPrice: GAS_PRICE });
    console.log(tx);

    console.log("Data", await contract.data);
  };

  readData = async () => {
    let data = await this.state.contract.methods.data().call();
    this.setState({ data });
  };

  readAllData = async () => {
    let allData = await this.state.contract.methods.getAllData().call();
    let result = {};
    allData = allData.map((element) => Number(element));

    for (let i = 0; i < allData.length; i++) {
      result[i] = allData[i];
    }

    this.setState({ allData: result });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    let test = this.state.allData;
    console.log("test", test);

    return (
      <div className="App">
        <button onClick={this.activateLasers}>Activate Lasers</button>
        <button onClick={this.readData}>Read Data</button>
        <button onClick={this.readAllData}>Read Data</button>
        <LineChart data={this.state.allData} />
        <h1>{this.state.data}</h1>
      </div>
    );
  }
}

export default App;
