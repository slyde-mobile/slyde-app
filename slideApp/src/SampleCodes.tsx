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

// failed attempt at reverse lookup for an sns domain

// if (address) {
//   // Public key of bonfida.sol
//   console.log(address, RPC_URL);
//   // const domainKey = new PublicKey(address);
//   const rpcConnection = new Connection(RPC_URL);              
//   // const resolution = await resolve(rpcConnection, "asdf.slydedev.sol");
//   // console.log(resolution.toBuffer());
//   // const dk = getDomainKeySync("asdf.slydedev.sol");
//   // console.log('correct domain key for address', dk.pubkey.toBase58());
//   // const domainName = await reverseLookup(rpcConnection, domainKey);
//   // console.log(domainName);
//   // const SOL_TLD_AUTHORITY = new PublicKey(
//   //   "58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx"
//   // );
//   const filters = [
//     {
//       memcmp: {
//         offset: 32,
//         bytes: address,
//       },
//     },
//     {
//       memcmp: {
//         offset: 0,
//         bytes: '4b9bVPSELbWiWVZC6SijVYiYLxEEa6dNHTvMioKnhK4C',
//       },
//     },
//   ];
//   const trills = await rpcConnection.getProgramAccounts(NAME_PROGRAM_ID, {
//     filters,
//   });
//   const domains = trills.map((a) => a.pubkey);
//   console.log('domains', domains[0].toBase58());
//   // const reverse1 = await reverseLookup(rpcConnection, new PublicKey('4b9bVPSELbWiWVZC6SijVYiYLxEEa6dNHTvMioKnhK4C'));
//   // // const reverses = await reverseLookupBatch(rpcConnection, domains);
//   // console.log('reverses', reverse1);

//   const REVERSE_LOOKUP_CLASS = new PublicKey(
//     "B4dvdm1V5PipGHuwyM7u7ePeCftvk2DsxRa2jVG1iKTy"
//   );

//   const hashedReverseLookup = getHashedNameSync(address);
//   const reverseLookupAccount = getNameAccountKeySync(
//     hashedReverseLookup,
//     REVERSE_LOOKUP_CLASS
//   );
//   console.log('123');
//   const { registry } = await NameRegistryState.retrieve(
//     rpcConnection,
//     reverseLookupAccount
//   );
//   console.log('abc');
//   if (!registry.data) {
//     console.log('no account data!');
//     return;
//   }
//   const nameLength = new BN(registry.data.slice(0, 4), "le").toNumber();
//   return registry.data.slice(4, 4 + nameLength).toString();


// }



  // useEffect(() => { 
  //   const graphql = async () => {
  //     const client = new ApolloClient({
  //       uri: 'http://127.0.0.1:8080/graphql',
  //       cache: new InMemoryCache(),
  //     });

  //     const ret = await client
  //       .query({
  //         query: gql`
  //           query User($solanaPrimaryAddress: String) {
  //             user (solanaPrimaryAddress: $solanaPrimaryAddress) {
  //               solanaPrimaryAddress
  //               solanaSns
  //             }
  //           }
  //         `,
  //         variables: {
  //           solanaPrimaryAddress: address,
  //         }
  //       });
  //     console.log('graphql return', ret);
  //   };
  //   graphql();
  // }, []);