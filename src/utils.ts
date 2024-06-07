// Receives an array of functions that may be async, runs them _one at a time_
// giving the result of the previous function as argument to the next one.
// The argument for the first function is initialValue.
// Returns the result of the last function.
// Useful if you want to perform many async actions without concurrency.
export const asyncReduce = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asyncFunctions: ((argument: any) => Promise<any>)[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValue: any = undefined,
) =>
  asyncFunctions.reduce(
    async (previousPromise, asyncFunction) =>
      asyncFunction(await previousPromise),
    Promise.resolve(initialValue),
  );

export class InconsistencyError extends Error {
  constructor(model: string) {
    super(`${model} has attributes inconsistent with database`);
  }
}
