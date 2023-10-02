let gl = ['2121300', '2131110', '2131152', '2131662', '2201400', '2201713', '2202110', '2131151', '2121230', '2131652', '2131451']

const sql = (array) => array.map(value => `select  distinct '00'||substr(ga,3,2)||substr(ga,20,2) as branch_id, (substr(ga,9,7)) as gl from ga_deposit_balance where substr(ga,9,7) = '${value}' and '00'||substr(ga,3,2)||substr(ga,20,2) not in (select brn from combrch) order by substr(ga,9,7) asc;`)

console.log(sql(gl))

const fs = require('fs');

const data = 'This is the content of the file.';
fs.writeFile('example.txt', data, (err) => {
    if (err) throw err;
    console.log('File is created successfully.');
});