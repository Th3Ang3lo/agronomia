export default class StringHelper {
  static tryParseStringToNumber(string) {
    const tryParse = string.replace(",", ".");

    const tryParseToNumber = Number(tryParse);

    if(isNaN(tryParseToNumber)) {
      return string;
    }
    
    return tryParseToNumber;
  }
}