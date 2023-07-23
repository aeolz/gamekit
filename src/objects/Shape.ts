import Aeolz from "@aeolz/core"
import {
  GameKitSignalMiddlewares,
  Size,
  UniversalHitbox,
  Vector2d,
  intersection,
} from ".."

export abstract class Shape {
  position: Aeolz.Signal<Vector2d> = Aeolz.Signal(Vector2d(0, 0)).middleware(
    GameKitSignalMiddlewares.vector2dFilter
  )
  size: Size

  abstract get hitbox(): UniversalHitbox
  intersects(hitbox: UniversalHitbox): boolean {
    return intersection(this.hitbox, hitbox)
  }
}
