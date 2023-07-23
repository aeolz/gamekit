import { SignalMiddleware } from "@aeolz/core/lib/objects/Signal"
import { Vector2d, isVector2d, Size, isSize } from ".."

const Vector2dVerifyMiddleware: SignalMiddleware<Vector2d> = (vector) =>
  isVector2d(vector) ? vector : null
const SizeVerifyMiddleware: SignalMiddleware<Size> = (size) =>
  isSize(size) ? size : null

export const GameKitSignalMiddlewares = {
  vector2dFilter: Vector2dVerifyMiddleware,
  sizeFilter: SizeVerifyMiddleware,
}
