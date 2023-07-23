import Aeolz from "@aeolz/core"

const Vector2dTemplate = new Aeolz.Template<[x: number, y: number]>(
  ["x", "y"],
  { default: null, requireAll: true }
)

const SizeTemplate = new Aeolz.Template<[width: number, height: number]>(
  ["width", "height"],
  { default: null, requireAll: true }
)

export const GameKitTemplates = {
  vector2d: Vector2dTemplate,
  size: SizeTemplate,
}
