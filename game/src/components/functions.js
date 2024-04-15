export function xhrSend(url, method, params) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open(method, url);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.onload = function () {
			if (xhr.status >= 200 && xhr.status < 300) {
				resolve(xhr.response);
			} else {
				reject(new Error("Request failed with status " + xhr.status));
			}
		};
		xhr.onerror = function () {
			reject(new Error("Request failed"));
		};

		// Convert parameters object to URL-encoded string
		let paramString = "";
		if (params && typeof params === "object") {
			paramString = Object.keys(params)
				.map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(params[key]))
				.join("&");
		}

		// Send request with parameters
		if (method.toUpperCase() === "POST") {
			xhr.send(paramString);
		} else {
			xhr.send();
		}
	});
}
