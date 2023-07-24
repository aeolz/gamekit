import { SignalMiddleware } from "@aeolz/core/lib/objects/Signal"
import { Vector2d, isVector2d, Size, isSize } from ".."
import Aeolz from "@aeolz/core"

const Vector2dVerifyMiddleware: SignalMiddleware<Vector2d> = (vector) =>
  isVector2d(vector) ? vector : null

const SizeVerifyMiddleware: SignalMiddleware<Size> = (size) =>
  isSize(size) ? size : null

const NumberInRangeMiddleware: (
  min?: number,
  max?: number
) => SignalMiddleware<number> =
  (min = -Infinity, max = Infinity) =>
  (num) => {
    if (Aeolz.Utils.isNumber(min) && num < min) return min
    if (Aeolz.Utils.isNumber(max) && max < num) return max
    return num
  }

export const GameKitSignalMiddlewares = {
  vector2dFilter: Vector2dVerifyMiddleware,
  sizeFilter: SizeVerifyMiddleware,
  numberInRange: NumberInRangeMiddleware,
}
