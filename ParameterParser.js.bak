/**
 * General Documentation for Query Formats
 *
 * This documentation provides an overview of the query formats used for filtering data in database queries.
 * Each format follows a specific structure that allows for precise filtering based on various conditions.
 * Understanding these query formats is essential for effectively querying and retrieving specific data from a database.
 *
 * Query Format Structure:
 * Each query format consists of three main components separated by colons (:):
 * 1. Field Name: Represents the database field/column on which the filter is applied.
 * 2. Operator: Specifies the comparison operation to be performed on the field.
 * 3. Values: Contains one or more values that are used in the comparison operation.
 *
 * Operators and Their Meanings:
 * The operator defines the type of comparison to be performed on the field.
 *
 * Here are the operators used in the provided query formats and their meanings:
 * - Equal To (=): Filters records where the field is equal to the specified value.
 *
 * - Not Equal To (!=): Filters records where the field is not equal to the specified value.
 *
 * - Greater Than (>): Filters records where the field is greater than the specified value
 *   (used in date and numeric comparisons).
 *
 * - Less Than (<): Filters records where the field is less than the specified value (used
 *   in date and numeric comparisons).
 *
 * - Greater Than or Equal To (>=): Filters records where the field is greater than or equal
 *   to the specified value (used in date and numeric comparisons).
 *
 * - Less Than or Equal To (<=): Filters records where the field is less than or equal to
 *   the specified value (used in date and numeric comparisons).
 *
 * - Like (~): Filters records where the field contains a specified pattern (used for text comparisons).
 *
 * - Not Like (!~): Filters records where the field does not contain a specified pattern
 *   (used for text comparisons).
 *
 * - Between (><): Filters records where the field falls within a specified range (used for
 *   date and numeric comparisons).
 *
 * - Not Between (>!<): Filters records where the field does not fall within a specified range
 *   (used for date and numeric comparisons).
 *
 * - In ({.}): Filters records where the field's value matches any of the specified values (used
 *   for multiple value comparisons).
 *
 * - Not In ({!}): Filters records where the field's value does not match any of the specified
 *   values (used for multiple value comparisons).
 *


 * Value Representation:
 * Values in the query format can be single values (e.g., 'E', '2023-01-01') or multiple values
 *    enclosed in brackets or parentheses and separated by delimiters (e.g., ['IBM', 'DELL'], (2023-06-19|2021-09-01)).
 *
 * Usage and Examples:
 * The query formats are used in the field:operator:values format within SQL WHERE clauses to filter data based on specific conditions.
 * Examples of such conditions include filtering by dates, text patterns, ranges, or lists of values.
 *
 * Important Considerations:
 * 1. Proper understanding of the field's data type is crucial for selecting the appropriate operator and values.
 * 2. Delimiters and separators are essential for multiple value conditions.
 * 3. Syntax errors or mismatched data types may result in unexpected query behavior.
 *
 */


/*
const ParameterParser = function(url) {
    this.url = url;
    this.stack = [];
};

ParameterParser.OPENING_SQUARE_BRACKET = '[';
ParameterParser.CLOSING_SQUARE_BRACKET = ']';

function getSubstr(str, target, from) {
    let chr = '';
    let tmp = '';
    let i = from;

    do {
        tmp += chr;
        i++;
        chr = str.charAt(i);
    } while ( -1 === target.indexOf(chr) && i < str.length );
    // while ( chr !== target && i < str.length );

    return tmp;
}

function reset(object) {
    object.tmp = '';
    object.value = '';
    object.key = '';
    object.op = '';
}

function addExpression(object) {
    this.stack.push({
        key: object.key.substring(0),
        op: object.op.substring(0),
        value: object.value.substring(0)
    });

    reset(object);
}

ParameterParser.prototype.parse = function(str) {
    let chr = '';

    let object = {};
    object.tmp = '';
    object.chr = '';
    object.key = '';
    object.value = '';
    object.op = '';

    this.stack = [];
    for ( let i = 0; i < str.length; i++ ) {
        chr = str.charAt(i);

        if ( chr === ':' ) {
            if ( object.op === '' && object.key !== '' ) {
                object.op = String(object.tmp);
                object.tmp = '';

                chr = str.charAt(i + 1);
                if ( chr !== '(' && '[' !== chr ) {
                    object.value = getSubstr(str, ',', i);
                    i += object.value.length;

                    addExpression.call(this, object);
                }
            }
            else if ( object.key === '' ) {
                object.key = String(object.tmp);
                object.tmp = '';
            }
        }
        else if ( chr === '[' ) {
            const raw = getSubstr(str, ']', i);
            i += raw.length + 1;

            object.value = object.tmp + '[' + raw + ']';
            addExpression.call(this, object);
        }
        else if ( chr === '(' ) {
            const raw = getSubstr(str, ')', i);
            i += raw.length + 1;

            object.value = object.tmp + '(' + raw + ')';
            addExpression.call(this, object);
        }
        else if ( chr !== ',' ) {
            object.tmp += chr;
        }
    }

    return this.stack;
};


module.exports = ParameterParser;
*/










/*
 * Expression class
 */
function Expression() {
    this.tmp = '';
    this.key = '';
    this.value = '';
    this.op = '';
}

Expression.prototype.reset = function () {
    this.tmp = '';
    this.value = '';
    this.key = '';
    this.op = '';
};

Expression.prototype.addExpression = function (parser) {
    parser.stack.push({
        key: this.key,
        op: this.op,
        value: this.value,
    });

    this.reset();
};


/*
 * ParameterParser class
 */
const ParameterParser = function (url) {
    this.url = url;
    this.stack = [];
};


ParameterParser.prototype._getSubstr = function(str, target, from) {
    let chr = '';
    let tmp = '';
    let i = from;

    do {
        tmp += chr;
        i++;
        chr = str.charAt(i);
    } while (target.indexOf(chr) === -1 && i < str.length);

    return tmp;
};


ParameterParser.prototype.lexerize = function (str) {
    const expression = new Expression();
    for (let i = 0; i < str.length; i++) {
        const chr = str.charAt(i);

        if (chr === ParameterParser.COLON) {
            if (expression.op === '' && expression.key !== '') {
                expression.op = String(expression.tmp);
                expression.tmp = '';

                const nextChr = str.charAt(i + 1);
                if (nextChr !== ParameterParser.OPENING_PARENTHESIS &&
                    ParameterParser.OPENING_SQUARE_BRACKET !== nextChr) {
                    expression.value = this._getSubstr(str, ParameterParser.COMMA, i);
                        i += expression.value.length;

                    expression.addExpression(this);
                }
            } else if (expression.key === '') {
                expression.key = String(expression.tmp);
                expression.tmp = '';
            }
        } else if (chr === ParameterParser.OPENING_SQUARE_BRACKET ||
                    ParameterParser.OPENING_PARENTHESIS === chr) {
            const delimiter = chr === ParameterParser.OPENING_SQUARE_BRACKET
                ? ParameterParser.CLOSING_SQUARE_BRACKET
                : ParameterParser.CLOSING_PARENTHESIS;

            const raw = this._getSubstr(str, delimiter, i);
                i += raw.length + 1;

            expression.value = expression.tmp + chr + raw + delimiter;
            expression.addExpression(this);
        } else if (chr !== ParameterParser.COMMA) {
            expression.tmp += chr;
        }
    }

    return this.stack;
};

ParameterParser.prototype.parse = function (str) {
    const collection = this.lexerize(str);
    collection.forEach((exp) => {
        if ( exp.value.startsWith(ParameterParser.OPENING_SQUARE_BRACKET) &&
            !exp.value.endsWith(ParameterParser.CLOSING_SQUARE_BRACKET)) {
            throw new Error("BadFormat: Unbalanced brackets.");
        }
        else if ( exp.value.startsWith(ParameterParser.OPENING_PARENTHESIS) &&
            !exp.value.endsWith(ParameterParser.CLOSING_PARENTHESIS)) {
            throw new Error("BadFormat: Unbalanced parenthesis.");
        }
        else if ( exp.op === '><' || '>!<' === exp.op ) {
            if ( !/^.+\*.+$/.test(exp.value) ) {
                throw new Error("BadValue: Invalid range format.");
            }
        }
    });

    return collection;
};


Object.defineProperties(ParameterParser, {
    OPENING_SQUARE_BRACKET: {
        value: '[',
        writable: true
    },
    CLOSING_SQUARE_BRACKET: {
        value: ']',
        writable: false,
    },
    COLON: {
        value: ':',
        writable: false,
    },
    COMMA: {
        value: ',',
        writable: false
    },
    OPENING_PARENTHESIS: {
        value: '(',
        writable: false,
    },
    CLOSING_PARENTHESIS: {
        value: ')',
        writable: false
    }
});

module.exports = ParameterParser;
