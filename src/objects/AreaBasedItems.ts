import { Gettable } from "@aeolz/core/lib/objects/Gettable"
import { Vector2d, Size, UniversalHitbox, intersection } from ".."

type Constructor<T> = new (...args: any[]) => T

export interface Area<T> {
  position: Vector2d
  items: T
}

export class AreaBasedItems<T extends object> {
  areas: Area<T>[] = []

  constructor(
    readonly classType: Gettable<Constructor<T>>,
    readonly areaSize: Size
  ) {}

  for(hitbox?: UniversalHitbox) {
    let areas = !hitbox
      ? this.areas
      : this.areas.filter((area) =>
          intersection(hitbox, {
            point: area.position,
            size: this.areaSize,
          })
        )

    const q = areas.map((area) => area.items)

    return new AreaBasedItemsHandler(q)
  }

  init(absoluteSize: Size) {
    const size = absoluteSize
    this.areas = []
    for (let x = 0; x < size.width; x += this.areaSize.width) {
      for (let y = 0; y < size.height; y += this.areaSize.height) {
        this.areas.push({
          position: Vector2d(x, y),
          items: new (Gettable(this.classType))(),
        })
      }
    }
  }
}

class AreaBasedItemsHandler<T extends object> {
  constructor(private itemsGroup: T[]) {}

  get<K extends keyof T>(key: K, uniqueKey: keyof T[K]): T[K][] {
    return this.itemsGroup.reduce((aggr, group) => {
      if (key in group) {
        aggr.push(
          ...(Array.isArray(group[key]) ? group[key] : []).filter(
            (item) => !aggr.find((it) => it[uniqueKey] === item[uniqueKey])
          )
        )
      }
      return aggr
    }, [] as T[K][])
  }

  add<K extends keyof T>(key: K, ...data: T[K][]): this {
    this.itemsGroup.forEach((group) => {
      if (key in group) {
        const arr: any = group[key]
        Array.isArray(arr) && arr.push(...data)
      }
    })
    return this
  }

  remove<K extends keyof T, UK extends keyof T[K]>(
    key: K,
    uniqueKey: UK,
    val: T[K][UK]
  ): this {
    this.itemsGroup.forEach((group) => {
      if (key in group) {
        // @ts-ignore
        group[key] = (Array.isArray(group[key]) ? group[key] : []).filter(
          (item) => (uniqueKey in item ? item[uniqueKey] !== val : true)
        )
      }
    })

    return this
  }
}
