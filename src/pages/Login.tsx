import { useState } from "react";
import { FiLock, FiUser } from "react-icons/fi";
import { GiDiamondRing } from "react-icons/gi";
import { doc, getDoc } from "firebase/firestore";
import { masterDb } from "../firebase/masterFirebase";
import { useFirebaseConfig } from "../context/FirebaseContext";
import { initShopFirebase } from "../firebase/dynamicFirebase";
import "./Login.css";

export default function Login() {
  const [shopId, setShopId] = useState("");
  const [password, setPassword] = useState("");
  const { setShopConfig } = useFirebaseConfig();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!shopId || !password) return alert("Enter credentials");

    setLoading(true);
    try {
      const ref = doc(masterDb, "shops", shopId);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        alert("Shop not found");
        setLoading(false);
        return;
      }

      const data = snap.data();
      if (data.password !== password) {
        alert("Invalid password");
        setLoading(false);
        return;
      }

      const config = {
        apiKey: data.apiKey,
        authDomain: data.authDomain,
        projectId: data.projectId,
        appId: data.appId,
        messagingSenderId: data.messagingSenderId,
        measurementId: data.measurementId,
        shopName: data.shopName,
      };

   setShopConfig(config); // this now saves to localStorage automatically
initShopFirebase(config);

    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-brand">
          <GiDiamondRing className="brand-icon" />
          <h1>Jewellery Admin</h1>
          <p>by Shreyansh Webcraft</p>
        </div>

        <div className="input-group">
          <FiUser />
          <input
            placeholder="Shop ID"
            value={shopId}
            onChange={(e) => setShopId(e.target.value)}
          />
        </div>

        <div className="input-group">
          <FiLock />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Authenticating..." : "Login Securely"}
        </button>
      </div>
    </div>
  );
}
