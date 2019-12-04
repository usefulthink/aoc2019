const fs = require('fs');
const assert = require('assert');

const inputNumbers = fs.readFileSync('01-in.txt', 'utf-8')
    .split('\n')
    .map(Number);

(async () => {
    const fuelRequired = mass => Math.floor(mass / 3) - 2;

    function totalFuelRequired(mass) {
        const fuelMass = fuelRequired(mass);
        return fuelMass > 0 ? fuelMass + totalFuelRequired(fuelMass) : 0;
    }

    assert.equal(fuelRequired(12), 2);
    assert.equal(fuelRequired(14), 2);
    assert.equal(fuelRequired(1969), 654);
    assert.equal(fuelRequired(100756), 33583);

    console.log(
        'part one:',
        inputNumbers.map(fuelRequired).reduce((sum, x) => sum + x)
    );

    assert.equal(totalFuelRequired(14), 2, 'example 1');
    assert.equal(totalFuelRequired(1969), 966, 'example 2');
    assert.equal(totalFuelRequired(100756), 50346, 'example 3');

    console.log(
        'part two:',
        inputNumbers.map(totalFuelRequired).reduce((sum, x) => sum + x)
    );
})();