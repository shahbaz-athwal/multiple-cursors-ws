import { PerfectCursor } from "perfect-cursors"
import React from "react"

export function usePerfectCursor(
  cb: (point: number[]) => void,
  point?: number[]
) {
  const [pc] = React.useState(() => new PerfectCursor(cb))

  React.useLayoutEffect(() => {
    if (point) pc.addPoint(point)
    return () => pc.dispose()
  }, [pc])

  const onPointChange = React.useCallback(
    (point: number[]) => pc.addPoint(point),
    [pc]
  )

  return onPointChange
}