import { Vector2d, Size } from ".."

export class GameMath {
  static vectorsOfRotatedRectangle(
    center: Vector2d,
    { width, height }: Size,
    angle: number
  ): [
    topLeft: Vector2d,
    topRight: Vector2d,
    bottomRight: Vector2d,
    bottomLeft: Vector2d
  ] {
    const Top_Right = Vector2d(0, 0),
      Top_Left = Vector2d(0, 0),
      Bot_Right = Vector2d(0, 0),
      Bot_Left = Vector2d(0, 0)

    Top_Right.x =
      center.x + (width / 2) * Math.cos(angle) - (height / 2) * Math.sin(angle)
    Top_Right.y =
      center.y + (width / 2) * Math.sin(angle) + (height / 2) * Math.cos(angle)

    Top_Left.x =
      center.x - (width / 2) * Math.cos(angle) - (height / 2) * Math.sin(angle)
    Top_Left.y =
      center.y - (width / 2) * Math.sin(angle) + (height / 2) * Math.cos(angle)

    Bot_Left.x =
      center.x - (width / 2) * Math.cos(angle) + (height / 2) * Math.sin(angle)
    Bot_Left.y =
      center.y - (width / 2) * Math.sin(angle) - (height / 2) * Math.cos(angle)

    Bot_Right.x =
      center.x + (width / 2) * Math.cos(angle) + (height / 2) * Math.sin(angle)
    Bot_Right.y =
      center.y + (width / 2) * Math.sin(angle) - (height / 2) * Math.cos(angle)
    return [Top_Left, Top_Right, Bot_Right, Bot_Left]
  }

  static pythagorean(sideA: number, sideB: number) {
    return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2))
  }

  static xyOfIndex(
    index: number,
    tiles: Size,
    position: "center" | "start" | "end" = "start",
    tile: Size = Size(1, 1)
  ): Vector2d {
    const vector = Vector2d(
      Math.floor(index % tiles.width) * tile.width,
      Math.floor(index / tiles.height) * tile.height + tile.height
    )
    switch (position) {
      case "center":
        vector.x += tile.width / 2
        vector.y += tile.height / 2
        break

      case "end":
        vector.x += tile.width
        vector.y += tile.height
        break

      default:
        break
    }
    return vector
  }

  static distance(i: Vector2d, f: Vector2d): number {
    return Math.abs(Math.sqrt(Math.pow(f.x - i.x, 2) + Math.pow(f.y - i.y, 2)))
  }

  /**
   * @param p1 point 1
   * @param p2 point 2
   * @returns angle in radians
   */
  static theta(p1: Vector2d, p2: Vector2d): number {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x)
  }

  static vectorWithThetaAndRange(
    from: Vector2d,
    theta: number,
    range: number
  ): Vector2d {
    return Vector2d(
      from.x + range * Math.cos(theta),
      from.y + range * Math.sin(theta)
    )
  }
}
