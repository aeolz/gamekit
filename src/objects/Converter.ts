import { Vector2d } from "../index"
import { Buffer } from "buffer"

export class Converter {
  static pointToXYArray(point: Vector2d): [x: number, y: number] {
    return [point.x, point.y]
  }

  static pointArrayToXYArray(points: Vector2d[]): number[] {
    return points.map((point) => [point.x, point.y]).flat()
  }

  static degreesToRadians(deg: number): number {
    return (deg * Math.PI) / 180
  }

  static radiansToDegrees(rad: number): number {
    return (rad / Math.PI) * 180
  }

  static objectToBinaryBuffer(obj: object, b64: boolean = true): Uint8Array {
    // Convert the object to a JSON string
    let jsonString = JSON.stringify(typeof obj !== "object" ? {} : obj)
    if (b64) jsonString = this.stringToBase64(jsonString)
    // Create a TextEncoder to encode the JSON string to a Uint8Array
    const textEncoder = new TextEncoder()
    const encodedData = textEncoder.encode(jsonString)

    // Return the Uint8Array, which can be sent via WebSocket
    return encodedData
  }

  static binaryBufferToObject(
    binaryBuffer: Uint8Array,
    b64: boolean = true
  ): object {
    // Create a TextDecoder to decode the binary data
    const textDecoder = new TextDecoder()
    let jsonString = textDecoder.decode(binaryBuffer)
    if (b64) jsonString = this.base64ToString(jsonString)
    // Parse the JSON string to get the original object
    const obj = JSON.parse(jsonString)
    return obj
  }

  static stringToBase64(str: string): string {
    return Buffer.from(typeof str !== "string" ? "" : str).toString("base64")
  }

  static base64ToString(base64: string): string {
    return Buffer.from(
      typeof base64 !== "string" ? "" : base64,
      "base64"
    ).toString()
  }
}
