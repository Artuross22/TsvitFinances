import React from "react";
import Image from "next/image";
import avatarSrc from "./images/Idee.jpg";

export default function Home() {
  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        src={avatarSrc}
        layout="fill"
        objectFit="cover"
        quality={100}
        alt="Background image"
      />
      <h1 style={{ position: "absolute", color: "green", top: "10%" }}>
        <strong>From simple to complex</strong>
      </h1>
    </div>
  );
}
