import { CSSProperties } from "react";
import { Nav } from "./Nav";

let styles: CSSProperties = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

export const NotYet = () => {
  return (
    <div>
      <Nav />
      <div style={styles}>
        <h1 className="text-4xl p-4">
          This feature is not available yet, check back in soon.
        </h1>
        <h3 className="text-2xl p-4">-Nate</h3>
      </div>
    </div>
  );
};
