export class UploadFileResponse {
  public fileNames: string[];
  public message: string;

  constructor(stringArray: string[], message: string) {
    this.fileNames = stringArray;
    this.message = message;
  }

  // You can also add methods to manipulate the string array and key
  addString(newString: string): void {
    this.fileNames.push(newString);
  }

  getKey(): string {
    return this.message;
  }

  setKey(newKey: string): void {
    this.message = newKey;
  }
}
