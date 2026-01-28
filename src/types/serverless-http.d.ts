/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'serverless-http' {
  const serverless: (app: any, options?: any) => any;
  export = serverless;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
