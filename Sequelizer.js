const { Op } = require("sequelize");
const Sequelizer = function() {
};


Sequelizer.prototype.buildSequelizeJSON = function(expressions){
    expressions.forEach((exp) => {
        return Object.assign(exp,
            this._toExpressionObject(exp));
    });

    return expressions;
};

Sequelizer.prototype._toExpressionObject = function(exp) {
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
        return {
            [exp.key]: {
                [exp.glue]: this._getValueArray(exp.value, exp.del)
                    .map(function(value){
                        return { [op]: value };
                    })
            }
        }
    }

    const op = this._getSequelizeOperator(exp.op);
    return {
        [exp.key]: {
            [op]: exp.value
        }
    };
};

Sequelizer.prototype._getBetweenStatement = function(exp, op) {
    const values = exp.value.split('*');
    return {
        [exp.key]: {
            [op]: values
        }
    };
};

Sequelizer.prototype._getLikeStatement = function(exp, op){
    if ( !exp.group ) {
        return { [exp.key]: { [op]: `%${exp.value}%` }};
    }

    const values = this._getValueArray(exp.value, exp.del);
    return {
        [exp.key]: {
            [exp.glue]: {
                [op]: {
                    [Op.any]: values.map(function(value){
                        return { [exp.key]: `%${value}%` }
                    })
                }
            }
        }
    };
};

Sequelizer.prototype._getInStatement = function(exp, op){
    const values = exp.value.split('|');
    return {
        [exp.key]: {
            [op]: values
        }
    };
};

Sequelizer.prototype._getSequelizeOperator = function(op) {
    switch( op ) {
        case '!=':
            return Op.ne;
        case '=':
            return Op.eq;
        case '>=':
            return Op.gte;
        case '<=':
            return Op.lte;
        case '!~':
            return Op.notLike;
        case '~':
            return Op.like;
        case '><':
            return Op.between;
        case '>!<':
            return Op.notBetween;
        case '{.}':
            return Op.in;
        case '{!}':
            return Op.notIn;
		case '<>':
			return Op.is;
		case '<!>':
			return Op.not;
        default:
            throw new Error(`Bad Operator ${op}`);
    }
};


Sequelizer.prototype._getArgumentsObject = function(value) {
    if ( value.startsWith('[') && value.endsWith(']') ) {
        return {
            glue: Op.and,
            del: ',',
            group: true
        };
    }
    if ( value.startsWith('(') && value.endsWith(')') ) {
        return {
            glue: Op.or,
            del: '|',
            group: true
        };
    }

    return {
        value: value
    };
};

Sequelizer.prototype._getValueArray = function(str, del) {
    return str.slice(1, -1)
        .split(del);
};

module.exports = Sequelizer;
