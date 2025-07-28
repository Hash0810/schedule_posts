import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { markPasskeyRegistered } from "../slices/authSlice";

// Utility functions for encoding/decoding
function bufferEncode(value) {
    return btoa(String.fromCharCode(...new Uint8Array(value)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}

function bufferDecode(value) {
    // Add padding if needed for base64url
    value = value.replace(/-/g, '+').replace(/_/g, '/');
    while (value.length % 4) {
        value += '=';
    }
    try {
        return Uint8Array.from(atob(value), c => c.charCodeAt(0));
    } catch (error) {
        console.error('Base64 decode error:', error);
        throw new Error('Invalid base64 string');
    }
}

export default function PasskeyAuth({ username, mode, onSuccess, onBack }) {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleRegisterPasskey = async () => {
    try {
      setStatus("Requesting options...");
      setError("");
      
      const optionsRes = await fetch(`/webauthn/register/options?username=${encodeURIComponent(username)}`);
      
      if (!optionsRes.ok) {
        throw new Error('Failed to get registration options');
      }
      
      const options = await optionsRes.json();
      
      // Convert challenge and user.id to Uint8Array
      options.challenge = bufferDecode(options.challenge);
      options.user.id = bufferDecode(options.user.id);
      
      // Convert excludeCredentials if present
      if (options.excludeCredentials) {
        options.excludeCredentials = options.excludeCredentials.map(cred => ({
          ...cred,
          id: bufferDecode(cred.id)
        }));
      }
      
      setStatus("Creating credential...");
      const credential = await navigator.credentials.create({ publicKey: options });
      
      if (!credential) {
        throw new Error('Failed to create credential');
      }
      
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
      
      setStatus("Registering credential...");
      const res = await fetch(`/webauthn/register?username=${encodeURIComponent(username)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentialData)
      });
      
      if (res.ok) {
        setStatus("Passkey registered successfully!");
        
        // Mark passkey as registered in the backend
        await dispatch(markPasskeyRegistered({ username }));
        
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1500);
      } else {
        const errorText = await res.text();
        throw new Error(`Registration failed: ${errorText}`);
      }
    } catch (err) {
      console.error('Passkey registration error:', err);
      setError(err.message || 'Passkey registration failed');
      setStatus("");
    }
  };

  const handleAuthenticatePasskey = async () => {
    try {
      setStatus("Getting authentication options...");
      setError("");
      
      const optionsRes = await fetch(`/webauthn/authenticate/options?username=${encodeURIComponent(username)}`);
      
      if (!optionsRes.ok) {
        throw new Error('Failed to get authentication options');
      }
      
      const options = await optionsRes.json();
      
      // Convert challenge and allowCredentials
      options.challenge = bufferDecode(options.challenge);
      if (options.allowCredentials) {
        options.allowCredentials = options.allowCredentials.map(cred => ({
          ...cred,
          id: bufferDecode(cred.id)
        }));
      }
      
      setStatus("Authenticating...");
      const credential = await navigator.credentials.get({ publicKey: options });
      
      if (!credential) {
        throw new Error('Authentication cancelled');
      }
      
      const credentialData = {
        id: credential.id,
        rawId: bufferEncode(credential.rawId),
        type: credential.type,
        response: {
          authenticatorData: bufferEncode(credential.response.authenticatorData),
          clientDataJSON: bufferEncode(credential.response.clientDataJSON),
          signature: bufferEncode(credential.response.signature),
          userHandle: credential.response.userHandle ? bufferEncode(credential.response.userHandle) : null
        },
        clientExtensionResults: credential.getClientExtensionResults ? credential.getClientExtensionResults() : {}
      };
      
      const res = await fetch(`/webauthn/authenticate?username=${encodeURIComponent(username)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentialData)
      });
      
      if (res.ok) {
        setStatus("Authentication successful!");
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1500);
      } else {
        const errorText = await res.text();
        throw new Error(`Authentication failed: ${errorText}`);
      }
    } catch (err) {
      console.error('Passkey authentication error:', err);
      setError(err.message || 'Authentication failed');
      setStatus("");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      {mode === 'register' ? (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
          onClick={handleRegisterPasskey}
          disabled={!!status}
          type="button"
        >
          {status ? "Processing..." : "Register Passkey"}
        </button>
      ) : (
        <button
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 disabled:opacity-50"
          onClick={handleAuthenticatePasskey}
          disabled={!!status}
          type="button"
        >
          {status ? "Processing..." : "Authenticate with Passkey"}
        </button>
      )}
      
      {onBack && (
        <button
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          onClick={onBack}
          type="button"
        >
          {mode === 'register' ? 'Skip for now' : 'Back'}
        </button>
      )}
      
      {status && (
        <div className="text-sm text-blue-600 text-center">{status}</div>
      )}
      
      {error && (
        <div className="text-sm text-red-600 text-center">{error}</div>
      )}
    </div>
  );
}