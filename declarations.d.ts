declare module '*.png' {
  const value: number;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '@mapbox/polyline' {
  interface Polyline {
    decode(encoded: string, precision?: number): [number, number][];
    encode(coordinates: [number, number][], precision?: number): string;
  }
  const polyline: Polyline;
  export = polyline;
}
