import { useEffect, useState } from "react";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

function WalletConnectionManager({ onConnect, onDisconnect }) {
  const [connector, setConnector] = useState(null);

  useEffect(() => {
    if (!connector) {
      const newConnector = new WalletConnect({
        bridge: "https://bridge.walletconnect.org",
        qrcodeModal: QRCodeModal,
      });

      if (!newConnector.connected) {
        newConnector.createSession();
      }

      setConnector(newConnector);

      newConnector.on("connect", (error, payload) => {
        if (error) {
          console.error("Connection Error:", error);
          return;
        }
        onConnect(payload);
      });

      newConnector.on("disconnect", (error) => {
        if (error) {
          console.error("Disconnect Error:", error);
          return;
        }
        onDisconnect();
        setConnector(null);
      });
    }

    return () => {
      if (connector) {
        connector.killSession();
      }
    };
  }, [connector, onConnect, onDisconnect]);

  return (
    <div className="wallet-connection-interface">
      {connector && !connector.connected && (
        <button onClick={() => connector.createSession()}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default WalletConnectionManager;
