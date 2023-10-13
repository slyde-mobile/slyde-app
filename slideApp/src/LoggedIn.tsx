import { uiConsole } from "./util";
import RPC from "./solanaRPC"

function LoggedIn(props: any) {

    const provider = props.provider;
    const web3auth = props.web3auth;
    const logout = props.logoutFn;

      const authenticateUser = async () => {
        if (!web3auth) {
          uiConsole("web3auth not initialized yet");
          return;
        }
        const idToken = await web3auth.authenticateUser();
        uiConsole(idToken);
      };
    
      const getUserInfo = async () => {
        if (!web3auth) {
          uiConsole("web3auth not initialized yet");
          return;
        }
        const user = await web3auth.getUserInfo();
        uiConsole(user);
      };
    
      const getAccounts = async () => {
        if (!provider) {
          uiConsole("provider not initialized yet");
          return;
        }
        const rpc = new RPC(provider);
        const address = await rpc.getAccounts();
        uiConsole(address);
      };
    
      const getBalance = async () => {
        if (!provider) {
          uiConsole("provider not initialized yet");
          return;
        }
        const rpc = new RPC(provider);
        const balance = await rpc.getBalance();
        uiConsole(balance);
      };
    
      const sendTransaction = async () => {
        if (!provider) {
          uiConsole("provider not initialized yet");
          return;
        }
        const rpc = new RPC(provider);
        const receipt = await rpc.sendTransaction();
        uiConsole(receipt);
      };
    
      const signMessage = async () => {
        if (!provider) {
          uiConsole("provider not initialized yet");
          return;
        }
        const rpc = new RPC(provider);
        const signedMessage = await rpc.signMessage();
        uiConsole(signedMessage);
      };
    
      const getPrivateKey = async () => {
        if (!provider) {
          uiConsole("provider not initialized yet");
          return;
        }
        const rpc = new RPC(provider);
        const privateKey = await rpc.getPrivateKey();
        uiConsole(privateKey);
      };

    return (
        <>
          <div className="flex-container">
            <div>
              <button onClick={getUserInfo} className="card">
                Get User Info
              </button>
            </div>
            <div>
              <button onClick={authenticateUser} className="card">
                Get ID Token
              </button>
            </div>
            <div>
              <button onClick={getAccounts} className="card">
                Get Accounts
              </button>
            </div>
            <div>
              <button onClick={getBalance} className="card">
                Get Balance
              </button>
            </div>
            <div>
              <button onClick={signMessage} className="card">
                Sign Message
              </button>
            </div>
            <div>
              <button onClick={sendTransaction} className="card">
                Send Transaction
              </button>
            </div>
            <div>
              <button onClick={getPrivateKey} className="card">
                Get Private Key
              </button>
            </div>
            <div>
              <button onClick={logout} className="card">
                Log Out
              </button>
            </div>
          </div>
          <div id="console" style={{ whiteSpace: "pre-line" }}>
            <p style={{ whiteSpace: "pre-line" }}>Logged in Successfully!</p>
          </div>
        </>
      );
}

export default LoggedIn