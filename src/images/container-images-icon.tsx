import React from "react";
import { Svg, type SvgProps } from "@k8slens/element-components";

export const ContainerImagesIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 16 16" fill="none" {...props}>
    <path
      d="M8 1.5 1.5 5 8 8.5 14.5 5Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <path d="M1.5 8 8 11.5 14.5 8" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M1.5 11 8 14.5 14.5 11" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" />
  </Svg>
);
