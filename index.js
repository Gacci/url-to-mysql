const http = require('http');
const lodash = require('lodash');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const qsa = [
    'advisoryOrganizationId:!=:[c0c7206b-be89-411c-b9dc-0189a926ffff,c0c7206b-be89-411c-b9dc-0189a9261980]',
    'jobStatusCode:!=:E',
    'jobEndDateTime:=:(2023-06-19|2021-09-01)',
    'createdAt:><:2021-09-01*2023-06-19',
    'name:!~:[IBM,DELL]',
    'lastName:!~:Justo',
    'alias:~:JJ',
    'status:{.}:pending|cancelled',
    'state:{!}:CA|AZ',
    'asOfDate:=:2023-01-01',
    'asOfDate:><:2023-01-01*2023-01-31'
];


const ParameterParser = require('./ParameterParser');
const Sequelizer = require('./Sequelizer');
const RawSQLizer = require('./RawSQLizer');

const parser    = new ParameterParser();
const parsed    = parser.parse(qsa.join(','));



const sequelizer   = new Sequelizer();
const where        = sequelizer.buildSequelizeJSON(lodash.cloneDeep(parsed));

console.log('QSA:\n', qsa, '\nPARSED:\n', parsed, '\nWHERE:\n',
    where, '\nJSON:\n', JSON.stringify(where, null, 4));

console.log('\n\n');
Object.entries(where)
    .forEach(function([k, v]) {
        console.log(v);
    });


console.log('----------------------------------------------------------------');
const mysqlizer    = new RawSQLizer();
console.log(mysqlizer.toString(parsed));
