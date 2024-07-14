function generateHeightMap(size, roughness) {
    let heightMap = [];

    // Inicializa a matriz do mapa de altura
    for (let i = 0; i < size; i++) {
        heightMap[i] = [];
        for (let j = 0; j < size; j++) {
            heightMap[i][j] = 0;
        }
    }

    // Define os cantos iniciais
    heightMap[0][0] = Math.random();
    heightMap[0][size - 1] = Math.random();
    heightMap[size - 1][0] = Math.random();
    heightMap[size - 1][size - 1] = Math.random();

    let sideLength = size - 1;
    let scale = roughness;

    while (sideLength > 1) {
        // Square step
        for (let x = 0; x < size - 1; x += sideLength) {
            for (let y = 0; y < size - 1; y += sideLength) {
                let avg = (heightMap[x][y] +
                           heightMap[x + sideLength][y] +
                           heightMap[x][y + sideLength] +
                           heightMap[x + sideLength][y + sideLength]) / 4;
                heightMap[x + sideLength / 2][y + sideLength / 2] = avg + (Math.random() * 2 - 1) * scale;
            }
        }

        // Diamond step
        for (let x = 0; x < size - 1; x += sideLength / 2) {
            for (let y = (x + sideLength / 2) % sideLength; y < size - 1; y += sideLength) {
                let avg = (heightMap[(x - sideLength / 2 + size) % size][y] +
                           heightMap[(x + sideLength / 2) % size][y] +
                           heightMap[x][(y + sideLength / 2) % size] +
                           heightMap[x][(y - sideLength / 2 + size) % size]) / 4;
                avg += (Math.random() * 2 - 1) * scale;
                heightMap[x][y] = avg;

                // Tratando as bordas
                if (x === 0) heightMap[size - 1][y] = avg;
                if (y === 0) heightMap[x][size - 1] = avg;
            }
        }

        sideLength /= 2;
        scale /= 2;
    }

    return heightMap;
}
