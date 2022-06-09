import React, {useEffect, useState} from "react";
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// 定数を宣言します。
const TWITTER_HANDLE = 'HARUKI05758694';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

// GIFのURL情報を格納するための配列
const TEST_GIFS = [
  "https://media.giphy.com/media/QvBoMEcQ7DQXK/giphy.gif",
  "https://media.giphy.com/media/ZNegC7wFpuQT7nurZ0/giphy.gif",
  "https://media.giphy.com/media/11JA9axStWivLUyhsB/giphy.gif"
];

/**
 * Appコンポーネント
 */
const App = () => {
  // ステート変数
  const [walletAddress, setWalletAddress] = useState(null);
  
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
   * 
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
  const renderConnectedContainer = () => (
    <div className="connected-container">
      <div className="gif-grid">
        {TEST_GIFS.map(gif => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );

  // 副作用フック
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

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