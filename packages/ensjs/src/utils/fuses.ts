const CANNOT_UNWRAP = 1
const CANNOT_BURN_FUSES = 2
const CANNOT_TRANSFER = 4
const CANNOT_SET_RESOLVER = 8
const CANNOT_SET_TTL = 16
const CANNOT_CREATE_SUBDOMAIN = 32
const PARENT_CANNOT_CONTROL = 64
const CAN_DO_EVERYTHING = 0

export const fuseEnum = {
  CANNOT_UNWRAP,
  CANNOT_BURN_FUSES,
  CANNOT_TRANSFER,
  CANNOT_SET_RESOLVER,
  CANNOT_SET_TTL,
  CANNOT_CREATE_SUBDOMAIN,
  PARENT_CANNOT_CONTROL,
} as const

export const unnamedFuses = [
  128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144,
  524288, 1048576, 2097152, 4194304, 8388608, 16777216, 33554432, 67108864,
  134217728, 268435456, 536870912, 1073741824, 2147483648, 4294967296,
] as const

const fullFuseEnum = {
  ...fuseEnum,
  CAN_DO_EVERYTHING,
}

export type FuseObj = typeof fuseEnum
export type CurrentFuses = { [f in keyof FuseObj]: boolean }
export type UnnamedFuseType = typeof unnamedFuses
export type Fuse = keyof FuseObj
export type UnnamedFuseValues = UnnamedFuseType[number]

// We need this type so that the following type isn't infinite. This type limits the max length of the fuse array to 7.
export type FuseArrayPossibilities =
  | [Fuse]
  | [Fuse, Fuse]
  | [Fuse, Fuse, Fuse]
  | [Fuse, Fuse, Fuse, Fuse]
  | [Fuse, Fuse, Fuse, Fuse, Fuse]
  | [Fuse, Fuse, Fuse, Fuse, Fuse, Fuse]
  | [Fuse, Fuse, Fuse, Fuse, Fuse, Fuse, Fuse]

/**
 * This type creates a type error if there are any duplicate fuses.
 * It effectively works like a reduce function, starting with 0 included types, adding a type each time, and then checking for duplicates.
 *
 * @template A The array to check for duplicates.
 * @template B The union of all checked existing types.
 */
// CLAUSE A: This extension unwraps the type as a fuse tuple.
type FusesWithoutDuplicates<A, B = never> = A extends FuseArrayPossibilities
  ? // CLAUSE A > TRUE: CLAUSE B: Pick out the first item in the current array, separating the current item from the rest.
    A extends [infer Head, ...infer Tail]
    ? // CLAUSE B > TRUE: CLAUSE C: Check if the current item is a duplicate based on the input union.
      Head extends B
      ? // CLAUSE C > TRUE: Duplicate found, return an empty array to throw a type error.
        []
      : // CLAUSE C > FALSE: Return a new array to continue the recursion, adds the current item type to the union.
        [Head, ...FusesWithoutDuplicates<Tail, Head | B>]
    : // CLAUSE B > FALSE: Return the input array as there is no more array elements to check.
      A
  : // CLAUSE A > FALSE: Return an empty array as it isn't a fuse tuple.
    []

export type NamedFusesToBurn = FusesWithoutDuplicates<FuseArrayPossibilities>

export default fullFuseEnum
