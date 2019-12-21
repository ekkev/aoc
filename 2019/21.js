const { Intcpu } = require('./13-2');

const stringAsAscii = str => str.split('').map(c => c.charCodeAt());
const isAscii = code => code <= 255;

const solve = (program, script, result = '') => {
    Intcpu(program).runWithIO(value => { isAscii(value) ? result += String.fromCharCode(value) : result = value }, stringAsAscii(script));
    return result;
}

let test = `109,2050,21101,0,966,1,21102,13,1,0,1106,0,1378,21102,1,20,0,1106,0,1337,21101,27,0,0,1105,1,1279,1208,1,65,748,1005,748,73,1208,1,79,748,1005,748,110,1208,1,78,748,1005,748,132,1208,1,87,748,1005,748,169,1208,1,82,748,1005,748,239,21102,1041,1,1,21101,0,73,0,1105,1,1421,21101,0,78,1,21101,1041,0,2,21102,1,88,0,1105,1,1301,21102,68,1,1,21102,1041,1,2,21102,1,103,0,1106,0,1301,1102,1,1,750,1106,0,298,21102,1,82,1,21102,1041,1,2,21101,125,0,0,1105,1,1301,1101,2,0,750,1106,0,298,21101,79,0,1,21101,0,1041,2,21102,1,147,0,1106,0,1301,21102,84,1,1,21101,1041,0,2,21102,1,162,0,1105,1,1301,1101,3,0,750,1105,1,298,21101,0,65,1,21101,0,1041,2,21102,1,184,0,1106,0,1301,21101,0,76,1,21101,0,1041,2,21101,199,0,0,1105,1,1301,21101,75,0,1,21102,1041,1,2,21102,1,214,0,1105,1,1301,21102,221,1,0,1106,0,1337,21101,10,0,1,21101,1041,0,2,21101,0,236,0,1105,1,1301,1106,0,553,21102,1,85,1,21102,1041,1,2,21101,254,0,0,1106,0,1301,21101,0,78,1,21102,1,1041,2,21102,269,1,0,1105,1,1301,21102,1,276,0,1106,0,1337,21102,1,10,1,21102,1041,1,2,21101,291,0,0,1106,0,1301,1101,0,1,755,1105,1,553,21101,0,32,1,21101,0,1041,2,21101,313,0,0,1106,0,1301,21102,1,320,0,1106,0,1337,21101,327,0,0,1105,1,1279,1201,1,0,749,21101,0,65,2,21102,1,73,3,21102,1,346,0,1106,0,1889,1206,1,367,1007,749,69,748,1005,748,360,1101,1,0,756,1001,749,-64,751,1106,0,406,1008,749,74,748,1006,748,381,1101,-1,0,751,1105,1,406,1008,749,84,748,1006,748,395,1101,0,-2,751,1106,0,406,21102,1,1100,1,21101,0,406,0,1106,0,1421,21101,0,32,1,21102,1100,1,2,21102,421,1,0,1106,0,1301,21101,428,0,0,1106,0,1337,21101,0,435,0,1105,1,1279,2102,1,1,749,1008,749,74,748,1006,748,453,1101,-1,0,752,1105,1,478,1008,749,84,748,1006,748,467,1101,0,-2,752,1105,1,478,21102,1,1168,1,21101,0,478,0,1105,1,1421,21102,485,1,0,1106,0,1337,21102,10,1,1,21101,1168,0,2,21102,500,1,0,1106,0,1301,1007,920,15,748,1005,748,518,21101,1209,0,1,21101,0,518,0,1106,0,1421,1002,920,3,529,1001,529,921,529,1001,750,0,0,1001,529,1,537,1002,751,1,0,1001,537,1,545,1001,752,0,0,1001,920,1,920,1106,0,13,1005,755,577,1006,756,570,21101,0,1100,1,21101,0,570,0,1106,0,1421,21101,0,987,1,1105,1,581,21101,0,1001,1,21102,588,1,0,1106,0,1378,1102,758,1,594,102,1,0,753,1006,753,654,21002,753,1,1,21101,0,610,0,1106,0,667,21101,0,0,1,21101,0,621,0,1105,1,1463,1205,1,647,21101,0,1015,1,21102,1,635,0,1106,0,1378,21102,1,1,1,21101,0,646,0,1106,0,1463,99,1001,594,1,594,1105,1,592,1006,755,664,1101,0,0,755,1105,1,647,4,754,99,109,2,1101,0,726,757,21201,-1,0,1,21101,0,9,2,21101,697,0,3,21102,1,692,0,1106,0,1913,109,-2,2106,0,0,109,2,1002,757,1,706,2101,0,-1,0,1001,757,1,757,109,-2,2105,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,255,63,159,191,95,127,223,0,46,68,200,234,187,123,126,182,53,62,125,236,61,103,204,168,235,114,77,108,214,42,140,102,245,170,172,70,166,136,107,106,188,115,50,163,78,124,205,139,203,162,190,110,86,183,184,98,39,157,35,99,228,231,254,54,59,158,49,215,238,154,100,109,242,247,199,248,113,58,143,101,181,229,87,142,120,252,202,175,216,198,220,111,218,243,241,56,92,250,76,237,141,213,38,57,167,189,178,197,177,152,222,69,51,85,251,212,233,55,230,94,219,201,84,171,239,93,232,179,137,71,122,249,47,246,196,185,207,173,156,217,119,79,174,169,153,206,121,60,244,43,138,118,117,186,227,221,34,226,253,116,155,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,73,110,112,117,116,32,105,110,115,116,114,117,99,116,105,111,110,115,58,10,13,10,87,97,108,107,105,110,103,46,46,46,10,10,13,10,82,117,110,110,105,110,103,46,46,46,10,10,25,10,68,105,100,110,39,116,32,109,97,107,101,32,105,116,32,97,99,114,111,115,115,58,10,10,58,73,110,118,97,108,105,100,32,111,112,101,114,97,116,105,111,110,59,32,101,120,112,101,99,116,101,100,32,115,111,109,101,116,104,105,110,103,32,108,105,107,101,32,65,78,68,44,32,79,82,44,32,111,114,32,78,79,84,67,73,110,118,97,108,105,100,32,102,105,114,115,116,32,97,114,103,117,109,101,110,116,59,32,101,120,112,101,99,116,101,100,32,115,111,109,101,116,104,105,110,103,32,108,105,107,101,32,65,44,32,66,44,32,67,44,32,68,44,32,74,44,32,111,114,32,84,40,73,110,118,97,108,105,100,32,115,101,99,111,110,100,32,97,114,103,117,109,101,110,116,59,32,101,120,112,101,99,116,101,100,32,74,32,111,114,32,84,52,79,117,116,32,111,102,32,109,101,109,111,114,121,59,32,97,116,32,109,111,115,116,32,49,53,32,105,110,115,116,114,117,99,116,105,111,110,115,32,99,97,110,32,98,101,32,115,116,111,114,101,100,0,109,1,1005,1262,1270,3,1262,20101,0,1262,0,109,-1,2105,1,0,109,1,21102,1288,1,0,1105,1,1263,21001,1262,0,0,1102,0,1,1262,109,-1,2105,1,0,109,5,21101,1310,0,0,1105,1,1279,21201,1,0,-2,22208,-2,-4,-1,1205,-1,1332,22101,0,-3,1,21102,1332,1,0,1105,1,1421,109,-5,2105,1,0,109,2,21102,1,1346,0,1106,0,1263,21208,1,32,-1,1205,-1,1363,21208,1,9,-1,1205,-1,1363,1105,1,1373,21102,1370,1,0,1105,1,1279,1105,1,1339,109,-2,2105,1,0,109,5,2102,1,-4,1386,20102,1,0,-2,22101,1,-4,-4,21101,0,0,-3,22208,-3,-2,-1,1205,-1,1416,2201,-4,-3,1408,4,0,21201,-3,1,-3,1106,0,1396,109,-5,2105,1,0,109,2,104,10,21202,-1,1,1,21102,1,1436,0,1106,0,1378,104,10,99,109,-2,2106,0,0,109,3,20002,594,753,-1,22202,-1,-2,-1,201,-1,754,754,109,-3,2105,1,0,109,10,21101,5,0,-5,21102,1,1,-4,21102,1,0,-3,1206,-9,1555,21102,3,1,-6,21101,0,5,-7,22208,-7,-5,-8,1206,-8,1507,22208,-6,-4,-8,1206,-8,1507,104,64,1105,1,1529,1205,-6,1527,1201,-7,716,1515,21002,0,-11,-8,21201,-8,46,-8,204,-8,1105,1,1529,104,46,21201,-7,1,-7,21207,-7,22,-8,1205,-8,1488,104,10,21201,-6,-1,-6,21207,-6,0,-8,1206,-8,1484,104,10,21207,-4,1,-8,1206,-8,1569,21102,1,0,-9,1105,1,1689,21208,-5,21,-8,1206,-8,1583,21101,1,0,-9,1105,1,1689,1201,-5,716,1589,20102,1,0,-2,21208,-4,1,-1,22202,-2,-1,-1,1205,-2,1613,21201,-5,0,1,21102,1613,1,0,1105,1,1444,1206,-1,1634,22102,1,-5,1,21101,0,1627,0,1106,0,1694,1206,1,1634,21102,2,1,-3,22107,1,-4,-8,22201,-1,-8,-8,1206,-8,1649,21201,-5,1,-5,1206,-3,1663,21201,-3,-1,-3,21201,-4,1,-4,1105,1,1667,21201,-4,-1,-4,21208,-4,0,-1,1201,-5,716,1676,22002,0,-1,-1,1206,-1,1686,21101,1,0,-4,1105,1,1477,109,-10,2106,0,0,109,11,21102,0,1,-6,21101,0,0,-8,21101,0,0,-7,20208,-6,920,-9,1205,-9,1880,21202,-6,3,-9,1201,-9,921,1725,20102,1,0,-5,1001,1725,1,1732,21002,0,1,-4,22102,1,-4,1,21102,1,1,2,21101,9,0,3,21101,0,1754,0,1105,1,1889,1206,1,1772,2201,-10,-4,1766,1001,1766,716,1766,21002,0,1,-3,1106,0,1790,21208,-4,-1,-9,1206,-9,1786,21202,-8,1,-3,1105,1,1790,22102,1,-7,-3,1001,1732,1,1796,20102,1,0,-2,21208,-2,-1,-9,1206,-9,1812,22102,1,-8,-1,1106,0,1816,22101,0,-7,-1,21208,-5,1,-9,1205,-9,1837,21208,-5,2,-9,1205,-9,1844,21208,-3,0,-1,1105,1,1855,22202,-3,-1,-1,1105,1,1855,22201,-3,-1,-1,22107,0,-1,-1,1105,1,1855,21208,-2,-1,-9,1206,-9,1869,22101,0,-1,-8,1106,0,1873,21201,-1,0,-7,21201,-6,1,-6,1105,1,1708,22101,0,-8,-10,109,-11,2105,1,0,109,7,22207,-6,-5,-3,22207,-4,-6,-2,22201,-3,-2,-1,21208,-1,0,-6,109,-7,2105,1,0,0,109,5,1201,-2,0,1912,21207,-4,0,-1,1206,-1,1930,21102,1,0,-4,21201,-4,0,1,22101,0,-3,2,21102,1,1,3,21101,1949,0,0,1105,1,1954,109,-5,2105,1,0,109,6,21207,-4,1,-1,1206,-1,1977,22207,-5,-3,-1,1206,-1,1977,21201,-5,0,-5,1105,1,2045,22101,0,-5,1,21201,-4,-1,2,21202,-3,2,3,21101,1996,0,0,1106,0,1954,22101,0,1,-5,21101,0,1,-2,22207,-5,-3,-1,1206,-1,2015,21102,0,1,-2,22202,-3,-2,-3,22107,0,-4,-1,1206,-1,2037,22101,0,-2,1,21102,2037,1,0,106,0,1912,21202,-3,-1,-3,22201,-5,-3,-5,109,-6,2105,1,0`;

// (D && !C) OR !A
console.log(solve(test, `NOT C T
OR D J
AND T J
NOT A T
OR T J
WALK
`), 19352720);

// ((!C || !B) && D && H) OR !A
console.log(solve(test, `NOT C J
NOT B T
OR T J
AND D J
AND H J
NOT A T
OR T J
RUN
`), 1143652885);
