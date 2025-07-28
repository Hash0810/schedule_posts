import React, { useState } from "react";

function bufferDecode(value) {
  return Uint8Array.from(atob(value), c => c.charCodeAt(0));
}

function bufferEncode(value) {
  return btoa(String.fromCharCode(...new Uint8Array(value)));
}

export default function PasskeySetup({ username }) {
  const [status, setStatus] = useState("");

  const handleRegisterPasskey = async () => {
    setStatus("Requesting options...");
    const optionsRes = await fetch(`/webauthn/register/options?username=${encodeURIComponent(username)}`);
    const options = await optionsRes.json();
    // Convert challenge and user.id to Uint8Array
    options.challenge = bufferDecode(options.challenge);
    options.user.id = bufferDecode(options.user.id);
    setStatus("Creating credential...");
    const credential = await navigator.credentials.create({ publicKey: options });
    // Prepare credential for sending to backend
    const credentialData = {
      id: credential.id,
      rawId: bufferEncode(credential.rawId),
      type: credential.type,
      response: {
        attestationObject: bufferEncode(credential.response.attestationObject),
        clientDataJSON: bufferEncode(credential.response.clientDataJSON),
      },
      clientExtensionResults: credential.getClientExtensionResults ? credential.getClientExtensionResults() : {}
    };
    setStatus("Sending credential...");
    const res = await fetch(`/webauthn/register?username=${encodeURIComponent(username)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentialData)
    });
    if (res.ok) {
      setStatus("Passkey registered successfully!");
    } else {
      setStatus("Passkey registration failed.");
    }
  };

  return (
    <div className="mt-4 flex flex-col items-center">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        onClick={handleRegisterPasskey}
        type="button"
      >
        Register Passkey
      </button>
      {status && <div className="mt-2 text-sm text-blue-700">{status}</div>}
    </div>
  );
}
