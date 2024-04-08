import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { GameContextProvider } from "./components/Context";

import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
	<HashRouter>
		<React.StrictMode>
			<GameContextProvider>
				<App />
			</GameContextProvider>
		</React.StrictMode>
	</HashRouter>
);
