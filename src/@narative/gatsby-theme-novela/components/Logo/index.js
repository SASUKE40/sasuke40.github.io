import React from 'react'

/**
 * Paste in your SVG logo and return it from this component.
 * Make sure you have a height set for your logo.
 * It is recommended to keep the height within 25-35px.
 * Logo comes with a property vallue called `fill`. `fill` is useful
 * when you want to change your logo depending on the theme you are on.
 */
export default function Logo({ fill }) {
  return (
    <svg width="200" height="32">
      <g>
        <path
          fill={fill}
          d="M32 30v-2h-2v-12h2v-2h-6v2h2v12h-6v-12h2v-2h-6v2h2v12h-6v-12h2v-2h-6v2h2v12h-6v-12h2v-2h-6v2h2v12h-2v2h-2v2h34v-2h-2z"
        ></path>
        <path fill={fill} d="M16 0h2l16 10v2h-34v-2l16-10z"></path>
        <text fontWeight="bold" y="24" x="48" fill={fill}>
          Edward
        </text>
        <text y="24" x="110" fill="#73737D">
          Elric
        </text>
      </g>
    </svg>
  )
}
