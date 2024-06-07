// Receives an array of functions that may be async, runs them _in order_
// giving the result of the previous function as argument to the next one.
// Argument for the first function is initialValue.
// Returns the result of the last function.
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
