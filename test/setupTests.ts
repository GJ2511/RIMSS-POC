// test/setupTests.ts
import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("next/image", async () => {
  const React = await import("react");
  return {
    __esModule: true,
    default: (props: any) => {
      const { src, alt, width, height, style } = props;
      return React.createElement("img", {
        src: typeof src === "string" ? src : (src as any)?.src ?? "",
        alt,
        width,
        height,
        style,
      });
    },
  };
});
