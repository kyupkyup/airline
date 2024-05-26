export function distribute(entry, dealer) {
    let parts, result, operation;

    if (entry >= 20 && entry <= 40) {
        parts = [0.5, 0.3, 0.2, 0];
        operation = 2// For entry between 11 and 20, inclusive
    } else if (entry > 40) {
        parts = [0.5, 0.25, 0.15, 0.1];
        operation = 3
    } else {
        parts = [0.7, 0.3, 0, 0];
        operation = 1
    }

    const pool = entry - operation - dealer
    result = parts.map(part => Math.floor(pool * part)); // Multiply each part by the entry
    let remainder = pool - result.reduce((a, b) => a + b); // Calculate the remainder

    // Sort the result in descending order and add the remainder
    result.sort((a, b) => b - a);

    for (let i = 0; i < remainder; i++) {
        result[i]++;
    }

    return result;
}