import React from "react";

export default function Footer() {
  return (
    <footer className="w3-container w3-container w3-black">
      <p className="w3-center">
        &#169; c13u {new Date(Date.now()).getFullYear()}
      </p>
    </footer>
  );
}
