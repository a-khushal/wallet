import { useEffect, useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet, ethers } from "ethers";

export const EthWallet = ({ mnemonic }: {
  mnemonic: string
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [publicKeysWithBalance, setPublicKeysWithBalance] = useState<{ publicKey: string, balance: string }[]>([]);

  const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_ETH_RPC_URL)

  useEffect(() => {
    const fetchBalances = async () => {
      const balancePromises = addresses.map(async (address) => {
        const balance = await provider.getBalance(address);
        return {
          publicKey: address,
          balance: balance.toString(),
        };
      });

      const balances = await Promise.all(balancePromises);
      setPublicKeysWithBalance(balances);
    };

    if (addresses.length > 0) {
      fetchBalances();
    }
  }, [addresses]);

  return (
    <div>
      <button onClick={async function() {
        const seed = await mnemonicToSeed(mnemonic);
        const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
        const hdNode = HDNodeWallet.fromSeed(seed);
        const child = hdNode.derivePath(derivationPath);
        const privateKey = child.privateKey;
        const wallet = new Wallet(privateKey);
        setCurrentIndex(currentIndex + 1);
        // @ts-ignore
        setAddresses([...addresses, wallet.address]);
      }}>
        Add ETH wallet
      </button>

      {publicKeysWithBalance.map((p, index) => (
        <div key={index}>
          {p.publicKey} - {p.balance} ETH
        </div>
      ))}
    </div>
  )
}
