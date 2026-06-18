import { Fragment } from "react";

// Standardized registered-trademark mark: superscript, ~0.4em, top-aligned,
// slight left margin so it never sits on the baseline.
export function Reg() {
  return <sup className="text-[0.4em] align-super ml-0.5">®</sup>;
}

// Render a (translated) string, converting every ® into a superscript <sup>.
// Returns the string unchanged when it contains no ®.
export function withReg(text) {
  if (typeof text !== "string" || !text.includes("®")) return text;
  return text.split("®").map((seg, i, arr) => (
    <Fragment key={i}>
      {seg}
      {i < arr.length - 1 ? <Reg /> : null}
    </Fragment>
  ));
}
