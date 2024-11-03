import { useEffect, useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";

interface SolanaWalletProps {
  mnemonic: string;
}

export function SolanaWallet({ mnemonic }: SolanaWalletProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [publicKeys, setPublicKeys] = useState<PublicKey[]>([]);
  const [publicKeysWithBalance, setPublicKeysWithBalance] = useState<{ publicKey: PublicKey, balance: number }[]>([])

  const addWallet = async () => {
    const seed = await mnemonicToSeed(mnemonic);
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);

    setCurrentIndex(currentIndex + 1);
    setPublicKeys([...publicKeys, keypair.publicKey]);
  };

  useEffect(() => {
    const fetchBalances = async () => {
      const connection = new Connection(import.meta.env.VITE_SOLANA_RPC_URL, "confirmed");

      const balancePromises = publicKeys.map(async (publicKey) => {
        let balance = await connection.getBalance(publicKey);
        balance = balance / LAMPORTS_PER_SOL
        return { publicKey, balance };
      });

      const balances = await Promise.all(balancePromises);
      setPublicKeysWithBalance(balances);
    };

    if (publicKeys.length > 0) {
      fetchBalances();
    }
  }, [publicKeys]);

  return (
    <div>
      <button onClick={addWallet}>
        Add SOL wallet
      </button>
      {publicKeysWithBalance.map((p, index) => (
        <div key={index}>
          {p.publicKey.toBase58()} - {p.balance} SOL
        </div>
      ))}
    </div>
  );
}

