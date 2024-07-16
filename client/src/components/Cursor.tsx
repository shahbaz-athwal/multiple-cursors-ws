import * as React from "react"
import { usePerfectCursor } from "@/hooks/usePerfectCursors"

const getRandomColor = () => {
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#33FFF3', '#8D33FF', '#FF8D33'];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}


export function Cursor({ point }: { point: number[] }) {
  const rCursor = React.useRef<SVGSVGElement>(null)
  const [randomColor, setRandomColor] = React.useState<string>("")

  React.useEffect(() => {
    setRandomColor(getRandomColor())
  }, [])

  const animateCursor = React.useCallback((point: number[]) => {
    const elm = rCursor.current
    if (!elm) return
    elm.style.setProperty(
      "transform",
      `translate(${point[0]}px, ${point[1]}px)`
    )
  }, [])

  const onPointMove = usePerfectCursor(animateCursor)

  React.useLayoutEffect(() => onPointMove(point), [onPointMove, point])

  return (
    <svg
      ref={rCursor}
      style={{
        position: "absolute",
        top: -15,
        left: -15,
        width: 30,
        height: 30,
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 35 35"
      fill="none"
      fillRule="evenodd"
    >
      <g fill="rgba(0,0,0,.2)" transform="translate(1,1)">
        <path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
        <path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
      </g>
      <g fill="black" opacity="0.6">
        <path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
        <path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
      </g>
      <g fill={randomColor} opacity="0.6">
        <path d="m19.751 24.4155-1.844.774-3.1-7.374 1.841-.775z" />
        <path d="m13 10.814v11.188l2.969-2.866.428-.139h4.768z" />
      </g>
    </svg>
  )
}
