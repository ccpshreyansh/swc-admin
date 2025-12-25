
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { FirebaseProvider } from "./context/FirebaseContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <FirebaseProvider>
    <App />
  </FirebaseProvider>
);
