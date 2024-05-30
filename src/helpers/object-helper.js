import StringHelper from "./string-helper.js";

export default class ObjectHelper {
    static mergeObjects(obj1, obj2) {
        const merged = { ...obj1 };
    
        for (const key in obj2) {
            if (obj2.hasOwnProperty(key)) {
                if (typeof obj2[key] === 'number' || !isNaN(parseFloat(obj2[key].replace(',', '.')))) {
                    const value = parseFloat(obj2[key].replace(',', '.')) || 0;
                    merged[key] = (merged[key] || 0) + value;
                }
            }
        }
    
        return merged;
    }

    static replaceCommasWithDotsAndConvertToNumber(obj) {
        // Iterate over the keys of the object
        for (var key in obj) {
            // Check if the key is valid and the value is a string
            if (obj.hasOwnProperty(key) && typeof obj[key] === 'string') {
                // Replace commas with dots and convert to number
                var numericValue = parseFloat(obj[key].replace(',', '.'));

                // Check if the conversion was successful
                if (!isNaN(numericValue)) {
                    // Update the value in the object
                    obj[key] = numericValue;
                }
            }
        }
        return obj;
    }

    static convertStringToNumbers(obj) {
        for (const [column, value] of Object.entries(obj)) {
            obj[column] = StringHelper.tryParseStringToNumber(value);
        }

        return obj;
    }
}