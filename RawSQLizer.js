

const Op = {
    between: 'BETWEEN',
    notBetween: 'NOT BETWEEN',
    in: 'IN',
    notIn: 'NOT IN',
    like: 'LIKE',
    notLike: 'NOT LIKE'
};


const RawSQLizer = function(){

};

RawSQLizer.prototype.toString = function(expressions) {
    return expressions
		.map((exp) => {
			return Object.assign(exp, { 
				alias: exp.alias || ''})
		})
		.map((exp) => {
			return Object.assign(exp, { 
				field: exp.alias ? exp.alias+'.'+exp.key : exp.key })
		})
		.map((exp) => {
			return Object.assign(exp,
				this._toExpressionArguments(exp));
		});

};


RawSQLizer.prototype._toExpressionArguments = function(exp) {
    if ( !exp.value ) {
        throw new Error("No value found.");
    }

    Object.assign(exp, this._getArgumentsObject(exp.value));
    if ( exp.op === '><' ) {
        return this._getBetweenStatement(exp, Op.between);
    }
    if ( exp.op === '>!<') {
        return this._getBetweenStatement(exp, Op.notBetween);
    }

    if ( exp.op === '{.}' ) {
        return this._getInStatement(exp, Op.in)
    }
    if ( exp.op === '{!}' ) {
        return this._getInStatement(exp, Op.notIn)
    }

    if ( exp.op === '~'  ) {
        return this._getLikeStatement(exp, Op.like);
    }
    if ( exp.op === '!~'  ) {
        return this._getLikeStatement(exp, Op.notLike);
    }


    if ( exp.group ) {
        const op = this._getSequelizeOperator(exp.op);
        const values = this._getValueArray(exp.value, exp.del);
        return {
            query: values.map(function(value, index){
                return exp.field+' '+exp.op+' :'+exp.key+index;
            }),
            replacements: values.reduce(function(accum, value, index){
                return Object.assign(accum, { [exp.field+index]: value });
            }, {})
        }
    }


    const op = this._getSequelizeOperator(exp.op);
    return {
        query: exp.field+' '+op+' :'+exp.key,
        replacements: {
            [exp.key]: exp.value
        }
    };

    return exp;
};



RawSQLizer.prototype._getBetweenStatement = function(exp, op) {


    const [from, to] = exp.value.split('*');
    return {
        query: exp.field+' '+op+' :'+exp.key+'0 AND :'+exp.key+'1',
        replacements: {
            [exp.key+0]: from,
            [exp.key+1]: to
        }
    };
};

RawSQLizer.prototype._getLikeStatement = function(exp, op){
    const values = exp.group
        ? this._getValueArray(exp.value, exp.del)
        : [ exp.value ];

    return {
        query: values.map((value, index) => {
            return exp.field+' '+op+' :'+exp.key+index;
        }),
        replacements: values.reduce((accum, value, index) => {
            return Object.assign(accum, {
                [exp.field+index]: '%'+value+'%'
            });
        }, {})
    };
};

RawSQLizer.prototype._getInStatement = function(exp, op){
    const values = exp.value.split('|')
    return {
        query: exp.field+' '+op+' (:'+exp.key+')',
        replacements: {
            [exp.field]: values.join(',')
        }
    };
};


RawSQLizer.prototype._getSequelizeOperator = function(op) {
    switch( op ) {
        case '!=':
        case '=':
        case '>=':
        case '<=':
            return op;
        case '!~':
            return 'NOT LIKE';
        case '~':
            return 'LIKE';
        case '><':
            return 'BETWEEN';
        case '>!<':
            return 'NOT BETWEEN';
        case '{.}':
            return 'IN';
        case '{!}':
            return 'NOT IN';
        default:
            throw new Error(`Bad Operator ${op}`);
    }
};

RawSQLizer.prototype._getArgumentsObject = function(value) {
    if ( value.startsWith('[') && value.endsWith(']') ) {
        return {
            glue: 'AND',
            del: ',',
            group: true
        };
    }
    if ( value.startsWith('(') && value.endsWith(')') ) {
        return {
            glue: 'OR',
            del: '|',
            group: true
        };
    }

    return {
        value: value
    };
};

RawSQLizer.prototype._getValueArray = function(str, del) {
    return str.slice(1, -1)
        .split(del);
};

module.exports = RawSQLizer;
