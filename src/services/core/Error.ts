export class AstoirError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "[ERROR]";
  }
}
