import * as Type from "lib/types"
import SVGPathComponent from "./SVGPathComponent"
import range from "lodash/range"
import { getPortPosition, getPortArrangementSize } from "@tscircuit/builder"
import getSVGPathBounds from "lib/utils/get-svg-path-bounds"

interface Props {
  component: {
    source: Type.SimpleBug
    schematic: Type.SchematicComponent
  }
}

export const SchematicBug = ({ component: { source, schematic } }: Props) => {
  const ports_arrangement = {
    top_size: 0,
    bottom_size: 0,
    ...schematic.port_arrangement,
  }
  // const port_labels = schematic.port_labels!
  const bugw = schematic.size.width // bug width
  const bugh = schematic.size.height
  const { total_ports } = getPortArrangementSize(ports_arrangement)
  // TODO throw if schematic.size doesn't match computed ports_arrangement size

  const paths = [
    {
      stroke: "red",
      strokeWidth: 0.02,
      d: `M ${-bugw / 2} ${-bugh / 2} L ${bugw / 2} ${-bugh / 2} L ${
        bugw / 2
      } ${bugh / 2} L ${-bugw / 2} ${bugh / 2}Z`,
    },
    ...range(1, total_ports + 1).map((portNum) => {
      const pos = getPortPosition(ports_arrangement, portNum)

      const x2 =
        pos.side === "left"
          ? -bugw / 2
          : pos.side === "right"
          ? bugw / 2
          : pos.x
      const y2 =
        pos.side === "top"
          ? -bugh / 2
          : pos.side === "bottom"
          ? bugh / 2
          : pos.y

      return {
        stroke: "red",
        strokeWidth: 0.02,
        d: `M ${pos.x} ${pos.y} L ${x2} ${y2}`,
      }
    }),
  ]

  const actualSize = getSVGPathBounds(paths.map((p) => p.d).join(" "))
  const actualCenter = {
    x: schematic.center.x + (actualSize.minX + actualSize.maxX) / 2,
    y: schematic.center.y + (actualSize.minY + actualSize.maxY) / 2,
  }

  return (
    <SVGPathComponent
      rotation={schematic.rotation}
      center={actualCenter}
      size={actualSize}
      paths={paths}
    />
  )
}

export default SchematicBug
