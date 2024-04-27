import Link from "next/link";
import React from "react";

type Props = {};

function Navbar({}: Props) {
  return (
    <header
      style={{
        backgroundColor: "#282c34",
        padding: "10px",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <nav>
        <ul style={{ listStyle: "none", display: "flex", gap: "10px" }}>
          <li>
            <Link href="/" passHref>
              <span style={{ color: "white", textDecoration: "none" }}>
                Home
              </span>
            </Link>
          </li>
          <li>
            <Link href="/about" passHref>
              <span style={{ color: "white", textDecoration: "none" }}>
                About
              </span>
            </Link>
          </li>
          <li>
            <Link href="/services" passHref>
              <span style={{ color: "white", textDecoration: "none" }}>
                Services
              </span>
            </Link>
          </li>
        </ul>
      </nav>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span style={{ color: "white" }}>Tsvit</span>
      </div>
      <nav>
        <ul style={{ listStyle: "none", display: "flex", gap: "10px" }}>
          <li>
            <Link href="/investing">
              <span style={{ color: "white", textDecoration: "none" }}>
                Investing
              </span>
            </Link>
          </li>
          <li>
            <Link href="/contact" passHref>
              <span style={{ color: "white", textDecoration: "none" }}>
                Treading
              </span>
            </Link>
          </li>
          <li>
            <Link href="/login" passHref>
              <span style={{ color: "white", textDecoration: "none" }}>
                Algorithms
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
