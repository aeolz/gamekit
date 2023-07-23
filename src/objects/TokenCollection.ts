import { Chest } from "anytool"

import { uuid } from "anytool"

const makeToken = () => uuid(100)

class TokenConstructor {
  private _token: string = makeToken()

  constructor()
  constructor(token: string)
  constructor(token?: string) {
    if (token) this._token = token
  }

  get current() {
    return this._token
  }

  regenerate() {
    this._token = makeToken()
  }

  toString() {
    return this._token
  }

  static newTokenString() {
    return makeToken()
  }
}

const Token = (token?: string) => new TokenConstructor(token)
type Token = TokenConstructor

export class TokenCollection<DATA extends any> {
  private chest = new Chest<string, DATA>()

  create(data: DATA) {
    const token = Token()
    this.chest.set(token.current, data)
    return token.current
  }

  findByKey<K extends keyof DATA>(key: K, val: DATA[K]): DATA {
    return this.chest.find((data) => data?.[key] === val)
  }

  get(token: string): DATA {
    return this.chest.get(token)
  }

  delete(token: string): void {
    this.chest.delete(token)
  }

  log() {
    console.log(this.chest.values())
  }
}
