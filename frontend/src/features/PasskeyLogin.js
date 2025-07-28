import React, { useState } from "react";

function bufferDecode(value) {
  return Uint8Array.from(atob(value), c => c.charCodeAt(0));
}

function bufferEncode(value) {
  return btoa(String.fromCharCode(...new Uint8Array(value)));
}

export default function PasskeyLogin({ username, onSuccess }) {
  const [status, setStatus] = useState("");

  const handlePasskeyLogin = async () => {
    setStatus("Requesting options...");
    const optionsRes = await fetch(`/webauthn/authenticate/options?username=${encodeURIComponent(username)}`);
    const assertionOptions = await optionsRes.json();
    assertionOptions.challenge = bufferDecode(assertionOptions.challenge);
    if (assertionOptions.allowCredentials) {
      assertionOptions.allowCredentials = assertionOptions.allowCredentials.map(cred => ({
        ...cred,
        id: bufferDecode(cred.id)
      }));
    }
    setStatus("Requesting credential...");
    const assertion = await navigator.credentials.get({ publicKey: assertionOptions });
    const credential = {
      id: assertion.id,
      rawId: bufferEncode(assertion.rawId),
      type: assertion.type,
      response: {
        authenticatorData: bufferEncode(assertion.response.authenticatorData),
        clientDataJSON: bufferEncode(assertion.response.clientDataJSON),
        signature: bufferEncode(assertion.response.signature),
        userHandle: assertion.response.userHandle ? bufferEncode(assertion.response.userHandle) : null
      }
    };
    setStatus("Verifying credential...");
    const body = {
      assertionRequest: assertionOptions, // send the original options as assertionRequest
      credential
    };
    const res = await fetch(`/webauthn/authenticate?username=${encodeURIComponent(username)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      setStatus("Passkey login successful!");
      if (onSuccess) onSuccess();
    } else {
      setStatus("Passkey login failed.");
    }
  };

  return (
    <div className="mt-4 flex flex-col items-center">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        onClick={handlePasskeyLogin}
        type="button"
      >
        Login with Passkey
      </button>
      {status && <div className="mt-2 text-sm text-blue-700">{status}</div>}
    </div>
  );
}
