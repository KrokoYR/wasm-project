import { instantiateStreaming } from '@assemblyscript/loader';

interface API {
  add(a: number, b: number): number;
  [index: string]: unknown;
}

const imports: any = {};

export const WASM_API = instantiateStreaming<API>(
  fetch('./optimized.wasm'),
  imports,
);
