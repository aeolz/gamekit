import { Vector2d } from "../index"

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

  static objectToBinaryBuffer(obj: object): Uint8Array {
    // Convert the object to a JSON string
    const jsonString = JSON.stringify(obj)

    // Create a TextEncoder to encode the JSON string to a Uint8Array
    const textEncoder = new TextEncoder()
    const encodedData = textEncoder.encode(jsonString)

    // Return the Uint8Array, which can be sent via WebSocket
    return encodedData
  }

  static binaryBufferToObject(binaryBuffer: Uint8Array): object {
    // Create a TextDecoder to decode the binary data
    const textDecoder = new TextDecoder()
    const jsonString = textDecoder.decode(binaryBuffer)

    // Parse the JSON string to get the original object
    const obj = JSON.parse(jsonString)
    return obj
  }
}
