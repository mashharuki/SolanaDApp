import React, {useEffect, useState} from "react";
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import Idl from "./idl/myepicproject.json";
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import KP from "./key/keypair.json";
require('dotenv').config();

// 定数を宣言します。
const TWITTER_HANDLE = 'HARUKI05758694';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

// SystemProgramはSolanaランタイムへの参照です。
const { SystemProgram, Keypair } = web3;
// GIFデータを保持するアカウントのキーペアを作成します。
const arr = Object.values(KP._keypair.secretKey);
const secret = new Uint8Array(arr);
// 秘密鍵からbaseaccount情報を取得
const baseAccount = web3.Keypair.fromSecretKey(secret);
// IDLファイルからプログラムIDを取得します。
const programID = new PublicKey(Idl.metadata.address);
// ネットワークをDevnetに設定します。
const network = clusterApiUrl(process.env.SOLANA_NETWORK);
// トランザクションが完了したときに通知方法を制御します。
const opts = {
  preflightCommitment: "processed"
}

/**
 * Appコンポーネント
 */
const App = () => {
  // ステート変数
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);
  
  /**
   * ウォレット接続状態を確認するためのメソッド
   */
  const checkIfWalletIsConnected = async () => {
    try {
      // Phatom Walletオブジェクトを取得する。
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
           /*
            * ウォレットアクセス許可の状況を確認する。
            */
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log('Connected with Public Key:', response.publicKey.toString());
          // ウォレットのアドレスを格納する。
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * CONECCT WALLETボタンを押した時の処理
   */
  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      // ウォレットに接続する。
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      // ステート変数を更新する。
      setWalletAddress(response.publicKey.toString());
    }
  };

  /**
   *  renderNotConnectedContainerコンポーネント
   */
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  /**
   * renderConnectedContainerコンポーネント
   */
  const renderConnectedContainer = () => {
    // アカウントが存在するか確認
    if (gifList === null) {
      return (
        <div className="connected-container">
          <button className="cta-button submit-gif-button" onClick={createGifAccount}>
            Do One-Time Initialization For GIF Program Account
          </button>
        </div>
      );
    } else {
      return (
        <div className="connected-container">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendGif();
            }}
          >
            <input 
              type="text" 
              placeholder="Enter gif link!" 
              value={inputValue}
              onChange={onInputChange}
            />
            <button type="submit" className="cta-button submit-gif-button">
              Submit
            </button>
          </form>
          <div className="gif-grid">
            {gifList.map((item, index) => (
              <div className="gif-item" key={index}>
                <img src={item.gifLink}/>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  /**
   * 入力フォームの値が変化したときに呼び出すメソッド
   */
  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  /**
   * GIFのURLデータをSolanaチェーンに送信するためのメソッド
   */
  const sendGif = async () => {
    if (inputValue.length === 0) {
      console.log("No gif link given!")
      return
    }
    setInputValue('');
    console.log('Gif link:', inputValue);

    try {
      // コントラクトの機能を使うための準備
      const provider = getProvider();
      const program = new Program(Idl, programID, provider);
      // addGifメソッドを呼び出す
      await program.rpc.addGif(inputValue, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
      console.log("GIF successfully sent to program", inputValue)
      // GIFデータを取得する。
      await getGifList();
    } catch (error) {
      console.log("Error sending GIF:", error)
    }
  };

  /**
   * プロバイダー情報を取得するためのメソッド
   */
  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection, window.solana, opts.preflightCommitment,
    );
    return provider;
  }

  /**
   * GIFを格納するためのアカウントを作成するメソッド
   */
  const createGifAccount = async () => {
    try {
      const provider = getProvider();
      const program = new Program(Idl, programID, provider);
      console.log("ping");
      // startStuffOffメソッドの呼び出し
      await program.rpc.startStuffOff({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount]
      });
      console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString());
      // GIFのリスト呼び出し
      await getGifList();
    } catch(error) {
      console.log("Error creating BaseAccount account:", error)
    }
  }

  /**
   * GIFの情報を取得するためのメソッド
   */
  const getGifList = async() => {
    try {
      // プロバイダー情報を取得
      const provider = getProvider();
      const program = new Program(Idl, programID, provider);
      // アカウントを取得する。
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  
      console.log("Got the account", account)
      setGifList(account.gifList)
  
    } catch (error) {
      console.log("Error in getGifList: ", error)
      setGifList(null);
    }
  }

  // 副作用フック
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');
      getGifList();
    }
  }, [walletAddress]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🖼 My First Solana DApp</p>
          <p className="sub-text">
            my GIF collection ✨
          </p>
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        <main className="main">
          {walletAddress && renderConnectedContainer()}
        </main>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;