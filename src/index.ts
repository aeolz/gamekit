import Aeolz from "@aeolz/core"
import { LoopOptions } from "@aeolz/core/lib/objects/Loop"
import { universalWithin } from "./objects/UniversalHitbox"
export * as intersects from "intersects"
export { Shape } from "./objects/Shape"
export { Converter } from "./objects/Converter"
export { GameMath } from "./objects/GameMath"
export { TokenCollection } from "./objects/TokenCollection"
export { GameKitTemplates } from "./objects/Templates"
export { Loader } from "./objects/Loader"
export { GameKitSignalMiddlewares } from "./objects/SignalMiddlewares"
export { AreaBasedItems } from "./objects/AreaBasedItems"

export type Vector2d = {
  x: number
  y: number
}

export function Vector2d(x: number = 0, y: number = 0): Vector2d {
  return { x, y }
}

export type Size = {
  width: number
  height: number
}

export function Size(width: number, height: number): Size {
  return { width, height }
}

export type UniversalHitbox =
  import("./objects/UniversalHitbox").UniversalHitbox

export function intersection(...universalHitboxes: UniversalHitbox[]): boolean {
  const [first, ...others] = universalHitboxes
  return others.every((hitbox) => universalWithin(first, hitbox))
}

export function isVector2d(obj: any): obj is Vector2d {
  return Aeolz.Utils.isNumber(obj?.x) && Aeolz.Utils.isNumber(obj?.y)
}

export function isSize(obj: any): obj is Size {
  return Aeolz.Utils.isNumber(obj?.width) && Aeolz.Utils.isNumber(obj?.height)
}

export function combineVectores(...vectores: Vector2d[]): Vector2d | null {
  const [first, ...others] = vectores
  if (!isVector2d(first)) return null
  return others.reduce(
    (aggr, vector) => {
      if (Aeolz.Utils.isNumber(vector?.x)) aggr.x += vector.x
      if (Aeolz.Utils.isNumber(vector?.y)) aggr.y += vector.y
      return aggr
    },
    { x: first.x, y: first.y }
  )
}

export function combineSizes(...sizes: Size[]): Size | null {
  const [first, ...others] = sizes
  if (!isSize(first)) return null
  return others.reduce(
    (aggr, vector) => {
      if (Aeolz.Utils.isNumber(vector?.width)) aggr.width += vector.width
      if (Aeolz.Utils.isNumber(vector?.height)) aggr.height += vector.height
      return aggr
    },
    { width: first.width, height: first.height }
  )
}

export type GameLoopOptions = {
  fps: number
} & Omit<LoopOptions, "engine" | "onDestroy" | "timeInSeconds">

export type GameLoopRequest = Aeolz.Global.LoopRequest & {
  callback: (delta: number) => void
}

export class GameLoop extends Aeolz.Loop {
  private running: boolean = false
  private _lastFrame: number = 0
  private fps: number
  private fps_interval: number

  constructor(name: string, options: GameLoopOptions) {
    const { fps, ...otherOptions } = options
    super(name, {
      ...otherOptions,
      engine: (reqs) => {},
      onDestroy: () => (this.running = false),
    })
    this.fps = fps
    this.fps_interval = 1000 / fps
    this.start()
  }

  start(): this {
    if (this.destroyed) return this
    this.running = true
    "engine" in this.options && this.loop(this.callback.bind(this))
    return this
  }

  pause(): this {
    this.running = false
    return this
  }

  request(
    req: Omit<Aeolz.Global.LoopRequest, "callback"> & {
      callback: (delta: number) => void
    }
  ): this {
    return super.request(req)
  }

  private loop(reqs: Aeolz.Global.LoopRequest["callback"]) {
    if (!this.running) return
    var now = Date.now()
    if (this._lastFrame + this.fps_interval <= now) {
      var delta = (now - this._lastFrame) / 1000
      this._lastFrame = now

      reqs(delta)
    }

    if (Date.now() - this._lastFrame < this.fps_interval - 16) {
      setTimeout(this.loop.bind(this, reqs))
    } else {
      setImmediate(this.loop.bind(this, reqs))
    }
  }
}

export function createGameLoop(
  name: string,
  fps: number,
  options: Omit<GameLoopOptions, "fps"> = {}
) {
  return new GameLoop(name, { fps, ...options })
}
