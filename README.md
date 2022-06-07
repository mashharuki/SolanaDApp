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