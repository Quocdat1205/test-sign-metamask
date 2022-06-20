import React, { Component } from "react";
import { getMessage } from "../../common/consts";
import axios from "axios";

class LoginComponent extends Component {
  constructor(props) {
    super(props);
    this.authenticate = this.authenticate.bind(this);
    this.state = { accessToken: "" };
  }

  authenticate = async () => {
    const walletAddress = this.props.account;
    const signature = await this.props.web3.currentProvider.send(
      "personal_sign",
      [
        getMessage(),
        walletAddress, // from which account should be signed. Web3, metamask will sign message by private key inconspicuously.
      ]
    );
    const signatureResult = signature.result;

    try {
      // make request to local server
      const { data } = await axios.post(
        `http://localhost:4000/api/insurance/user/log-in`,
        { walletAddress, signature: signatureResult },
        { withCredentials: true }
      );

      this.setState({ accessToken: data });
    } catch (error) {
      console.error(error);
    }
  };

  handlerCheck = async () => {
    const request = await axios.get(
      `http://localhost:4000/api/insurance/user/check-expire`,
      { withCredentials: true }
    );
    console.log(request);
  };

  render() {
    return (
      <div>
        <br></br>
        {this.state.accessToken ? (
          <>
            `User access token: ${this.state.accessToken}`
            <button onClick={() => this.handlerCheck()}>Click</button>
          </>
        ) : (
          <button onClick={this.authenticate}>Login</button>
        )}
      </div>
    );
  }
}

export default LoginComponent;
