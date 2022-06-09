# SolanaDApp
Solana上に構築するDApp用のリポジトリです。

### ローカルバリデーター起動コマンド
 `solana-test-validator`

### キーペア生成コマンド
 `solana-keygen new`

生成例
```cmd
Generating a new keypair

For added security, enter a BIP39 passphrase

NOTE! This passphrase improves security of the recovery seed phrase NOT the
keypair file itself, which is stored as insecure plain text

BIP39 Passphrase (empty for none): 

Wrote new keypair to {任意のディレクトリ}/.config/solana/id.json
=======================================================================
pubkey: 55s92MRAgtK2Sphuuz9Zokg1ur5UBuFUcn2p8TbMNfwp
=======================================================================
Save this seed phrase and your BIP39 passphrase to recover your new keypair:
{ここにシードフレーズが出力される}
=======================================================================
```

### 公開鍵確認コマンド
 `solana address`

### テスト実行コマンド
 `anchor test`

 テスト結果例
 ```cmd
  myepicproject
Your transaction signature vbd7Sw167XqpcWF9xTvdF5Pmj5HcrZHgic3k7vEfqhbmot5uG76oJwkPqE8iRdiKXeecrN4rT9axyiTN5W38aGk
    ✔ Is initialized! (389ms)


  1 passing (392ms)
 ```

 テスト結果例2
 ```cmd
  📝 Your transaction signature 5Zay6mANjmxS4K3wnzxv7QExKx8nmJyvL6NfBE94bCjRAurVdCnNwBP4NqqG5rdvV4PhCpLP5EuQaTL3nzGuR6KS
  👀 GIF Count 0
  👀 GIF Count 1
  👀 GIF List [
    {
      gifLink: 'insert_a_gif_link_here',
      userAddress: PublicKey {
        _bn: <BN: 3cadc33586cf8f6c168b5204ccba1ed6373fee46253f04c8ac222cee57287a8b>
      }
    }
  ]
  ✨  Done in 1.33s.
 ```

### Dev_netでエアドロップする際のコマンド
 `solana airdrop 2 5SJeUtdv28QL8hLvqayRotUqhPKZxYC2WK5gAM3HUbM6 --url https://api.devnet.solana.com`

### アカウントとは
 Solana の「アカウント」は「プログラムが読み書きできるファイル」のことを指す。

### プログラムIDとは
 プログラム ID とは、プログラムを読み込んで実行する方法を指定し、Solana ランタイムがどのようにプログラムを実行するかの情報を含んでいる ID のこと。  
 このプログラムIDがあることによってSolanaは生成したアカウントの情報にアクセスできる様になる。

### DEVNETへのデプロイ手順
 1. `solana config set --url devnet`
 2. `solana config get`

 ```cmd
 RPC URL: https://api.devnet.solana.com 
 ```
 3. `solana airdrop 2`
 4. `solana balance`

 5. 設定を変更する。
    Anchor.tomlを次の様に変更する。  
    [programs.localnet] を [programs.devnet] に変更する。  
    [cluster="localnet"] を [cluster="devnet"] に変更する。
 6. `anchor build`
 7.  プログラムIDを確認する。  
     `solana address -k target/deploy/myepicproject-keypair.json`
 8. 上記で確認したプログラムIDをlib.rsとAnchor.tomlに書き込む(プログラムIDを更新する。)
 9. `anchor build`
 10. `anchor deploy`  
     下記の様に表示されていれば成功

     ```cmd
     Program Id: Hw2tEssP4GFKppQ1fzrUyi5AMEYVkKGopJhdvpkneqnh

     Deploy success
     ```
     solana Explorのページが下記の通り  
     https://explorer.solana.com/address/Hw2tEssP4GFKppQ1fzrUyi5AMEYVkKGopJhdvpkneqnh?cluster=devnet

### Solana Explorer
 <a href="https://explorer.solana.com/?cluster=devnet">https://explorer.solana.com/?cluster=devnet</a>