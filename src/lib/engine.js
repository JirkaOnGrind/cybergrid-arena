export let pole = [[]];
export let arrayLength;
export let winningConnections;
export let movesNumber = 0;
export let difficulty = 'hard'; // Možnost změny obtížnosti pro minimax

// Inicializace herního pole a vynulování cache minimaxu
export function initEngine(size) {
    arrayLength = size;
    movesNumber = 0;
    
    // Původní logika přiřazování vítězných linií podle velikosti
    if(size === 3) winningConnections = 3;
    else if(size === 5) winningConnections = 4;
    else if(size === 7 || size === 9 || size === 14 || size === 15) winningConnections = 5;
    else if(size === 11 || size === 12) winningConnections = 6;
    else winningConnections = 5;

    // Vytvoření 2D pole vyplněného číslem 2 (prázdná pole)
    pole = Array.from({ length: size }, () => Array(size).fill(2));

    zobristTable.clear();
    precomputedLines = null;
    transpositionTable.table.clear();
}

export function fromTwoDimensional(cellY, cellX) {
    return cellY * arrayLength + cellX;
}

export function fromOneDimensional(cell) {
    return [Math.floor(cell / arrayLength), cell % arrayLength];
}

export function playEngine(player, field) {
    let wantedPosition = fromOneDimensional(field);
    if(emptyCell(pole, wantedPosition[0], wantedPosition[1])) {
        pole[wantedPosition[0]][wantedPosition[1]] = player;
        movesNumber++;
        return true;
    }
    return false;
}

export function playRobotEngine(ai) {
    let opponent = (ai === 0) ? 1 : 0;
    let move = bestMove(pole, opponent, ai, movesNumber);
    if (!move) return -1;
    
    pole[move[0]][move[1]] = ai;
    let i = fromTwoDimensional(move[0], move[1]);
    movesNumber++;
    return i;
}

export function checkWinEngine() {
    if(gameStatus(pole, 0) === true) return "X";
    if(gameStatus(pole, 1) === true) return "O";
    if(isBoardFull(pole)) return "tie";
    return null;
}

export function emptyCell(arrayGame, cellY, cellX) {
    return arrayGame[cellY][cellX] === 2;
}

// Původní logika pro kontrolu výhry (beze změny)
export function gameStatus(arrayGame, player){
    let tie = true;
    for(let i = 0; i < arrayGame.length; i++) {
        for(let j = 0; j < arrayGame[i].length; j++) {
            // ZKOUŠKA PRO X ---------------------------------------------------------
            for(let x = 0; x < winningConnections; x++) {
                if(j + x < arrayGame[i].length && arrayGame[i][j + x] === player) {
                    if(x == winningConnections - 1) {
                        return true;
                    }
                } else {
                    break;
                }
            }
            // ZKOUŠKA PRO Y ---------------------------------------------------------
            for(let y = 0; y < winningConnections; y++) {
                if(i + y < arrayGame.length && arrayGame[i + y][j] === player) {
                    if(y == winningConnections - 1) {
                        return true;
                    }
                } else {
                    break;
                }
            }
            // ZKOUŠKA ŠIKMO DOPRAVA -------------------------------------------------
            for(let r = 0; r < winningConnections; r++) {
                if(i + r < arrayGame.length && j + r < arrayGame[i].length && arrayGame[i + r][j + r] === player) {
                    if(r == winningConnections - 1) {
                        return true;
                    }
                } else {
                    break;
                }
            }
            // ZKOUŠKA ŠIKMO DOLEVA -------------------------------------------------
            for(let l = 0; l < winningConnections; l++) {
                if(i + l < arrayGame.length && j - l >= 0 && arrayGame[i + l][j - l] === player) {
                    if(l == winningConnections - 1) {
                        return true;
                    }
                } else {
                    break;
                }
            }
            if(arrayGame[i][j] != 2)
            {
                tie = false;
            }
        }
    }
    if(tie)
    {
        return "tie";
    }
    return false;
}

// =============================================================================
// MINIMAX (Zcela původní kód beze změn)
// =============================================================================
class TranspositionTable {
    constructor(maxSize = 2000000) {
        this.table = new Map();
        this.maxSize = maxSize;
        this.age = 0;
    }

    store(hash, depth, score, flag, bestMove) {
        const existing = this.table.get(hash);
        if (existing && existing.age === this.age &&
            existing.depth > depth &&
            !(existing.flag !== 'exact' && flag === 'exact')) {
            return;
        }
        if (this.table.size >= this.maxSize) {
            this.table.clear();
            this.age++;
        }
        this.table.set(hash, { depth, score, flag, bestMove, age: this.age });
    }

    probe(hash, depth, alpha, beta) {
        const entry = this.table.get(hash);
        if (!entry || entry.depth < depth) return null;

        if (entry.flag === 'exact') return entry;
        if (entry.flag === 'lowerbound' && entry.score >= beta) return entry;
        if (entry.flag === 'upperbound' && entry.score <= alpha) return entry;

        return null;
    }

    getBestMove(hash) {
        return this.table.get(hash)?.bestMove ?? null;
    }
}

const zobristTable = new Map();
const transpositionTable = new TranspositionTable();
let precomputedLines = null;

function initZobristTable(boardSize) {
    if (zobristTable.has(boardSize)) return;
    const table = [];
    for (let i = 0; i < boardSize; i++) {
        table[i] = [];
        for (let j = 0; j < boardSize; j++) {
            table[i][j] = [
                BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)),
                BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
            ];
        }
    }
    zobristTable.set(boardSize, table);
}

function computeInitialHash(arrayGame, boardSize, human, ai) {
    let hash = BigInt(0);
    const zobrist = zobristTable.get(boardSize);
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (arrayGame[i][j] === human) hash ^= zobrist[i][j][0];
            else if (arrayGame[i][j] === ai)  hash ^= zobrist[i][j][1];
        }
    }
    return hash;
}

function updateHash(currentHash, move, player, boardSize, human, ai) {
    const zobrist = zobristTable.get(boardSize);
    const idx = player === ai ? 1 : 0;
    return currentHash ^ zobrist[move[0]][move[1]][idx];
}

function precomputeWinningLines(boardSize, winningConnections) {
    const lines = [];
    for (let i = 0; i < boardSize; i++)
        for (let j = 0; j <= boardSize - winningConnections; j++)
            lines.push(Array.from({ length: winningConnections }, (_, k) => [i, j + k]));
    for (let i = 0; i <= boardSize - winningConnections; i++)
        for (let j = 0; j < boardSize; j++)
            lines.push(Array.from({ length: winningConnections }, (_, k) => [i + k, j]));
    for (let i = 0; i <= boardSize - winningConnections; i++)
        for (let j = 0; j <= boardSize - winningConnections; j++)
            lines.push(Array.from({ length: winningConnections }, (_, k) => [i + k, j + k]));
    for (let i = 0; i <= boardSize - winningConnections; i++)
        for (let j = winningConnections - 1; j < boardSize; j++)
            lines.push(Array.from({ length: winningConnections }, (_, k) => [i + k, j - k]));
    return lines;
}

function bestMove(arrayGame, human, ai, moveNumber) {
    const boardSize = arrayGame.length;

    initZobristTable(boardSize);
    if (precomputedLines === null || precomputedLines._boardSize !== boardSize) {
        precomputedLines = precomputeWinningLines(boardSize, winningConnections);
        precomputedLines._boardSize = boardSize;
    }

    if (moveNumber <= 2) {
        const openingMove = handleOpeningMoves(arrayGame, moveNumber, ai, human);
        if (openingMove != null) return openingMove;
    }

    const aiWin = findInstantWin(arrayGame, ai);
    if (aiWin) return aiWin;
    const humanWin = findInstantWin(arrayGame, human);
    if (humanWin) return humanWin;
    
    if (boardSize === 3) {
        const cornerDefenseMove = smallGridCornerAttack(arrayGame, human, ai);
        if (cornerDefenseMove) return cornerDefenseMove;
    }
    

    if (boardSize !== 3 && typeof difficulty !== 'undefined' && difficulty !== 'easy') {
        const aiWinningMove = findForks(arrayGame, ai, human);
        if (aiWinningMove.length > 0) return aiWinningMove[0];
        const blockingMove = findBestBlockingMove(arrayGame, human, ai);
        if (blockingMove) return blockingMove;
    }

    const maxDepth = calculateMaxDepth(arrayGame, moveNumber);
    let currentHash = computeInitialHash(arrayGame, boardSize, human, ai);
    let overallBestMove = null;

    for (let depth = 1; depth <= maxDepth; depth++) {
        let bestScore = -Infinity;
        let depthBestMove = null;
        let alpha = -Infinity;
        const beta = Infinity;

        const ttBestMove = transpositionTable.getBestMove(currentHash);
        const moves = getPrioritizedMoves(arrayGame, ai, human, ttBestMove);

        for (const [i, j] of moves) {
            if (arrayGame[i][j] !== 2) continue;

            arrayGame[i][j] = ai;
            const newHash = updateHash(currentHash, [i, j], ai, boardSize, human, ai);

            const score = enhancedMinimax(
                arrayGame, 0, depth, false, alpha, beta,
                newHash, human, ai, moveNumber + 1
            );

            arrayGame[i][j] = 2;

            if (score > bestScore) {
                bestScore = score;
                depthBestMove = [i, j];
            }
            alpha = Math.max(alpha, bestScore);
        }

        if (depthBestMove) overallBestMove = depthBestMove;
        if (bestScore >= 90000) break;
    }

    return overallBestMove;
}

function enhancedMinimax(arrayGame, depth, maxDepth, isMaximizing, alpha, beta, currentHash, human, ai, moveNumber) {
    const ttEntry = transpositionTable.probe(currentHash, depth, alpha, beta);
    if (ttEntry) return ttEntry.score;

    const terminalScore = getTerminalScore(arrayGame, depth, maxDepth, human, ai);
    if (terminalScore !== null) {
        transpositionTable.store(currentHash, depth, terminalScore, 'exact', null);
        return terminalScore;
    }

    const currentPlayer = isMaximizing ? ai : human;
    const opponent     = isMaximizing ? human : ai;

    const ttBestMove = transpositionTable.getBestMove(currentHash);
    const moves = getPrioritizedMoves(arrayGame, currentPlayer, opponent, ttBestMove);

    let bestScore = isMaximizing ? -Infinity : Infinity;
    let alphaOrig = alpha;
    let localBestMove = null;

    for (const [i, j] of moves) {
        if (arrayGame[i][j] !== 2) continue;

        arrayGame[i][j] = currentPlayer;
        const newHash = updateHash(currentHash, [i, j], currentPlayer, arrayGame.length, human, ai);

        const score = enhancedMinimax(
            arrayGame, depth + 1, maxDepth, !isMaximizing,
            alpha, beta, newHash, human, ai, moveNumber + 1
        );

        arrayGame[i][j] = 2;

        if (isMaximizing) {
            if (score > bestScore) { bestScore = score; localBestMove = [i, j]; }
            alpha = Math.max(alpha, bestScore);
        } else {
            if (score < bestScore) { bestScore = score; localBestMove = [i, j]; }
            beta = Math.min(beta, bestScore);
        }

        if (beta <= alpha) break; 
    }

    const flag = bestScore <= alphaOrig ? 'upperbound'
               : bestScore >= beta      ? 'lowerbound'
               :                          'exact';
    transpositionTable.store(currentHash, depth, bestScore, flag, localBestMove);

    return bestScore;
}

function getTerminalScore(arrayGame, depth, maxDepth, human, ai) {
    if (gameStatus(arrayGame, ai))    return 100000 - depth; 
    if (gameStatus(arrayGame, human)) return -100000 + depth; 
    if (isBoardFull(arrayGame))       return 0;
    if (depth >= maxDepth)            return evaluateBoard(arrayGame, human, ai, precomputedLines);
    return null;
}

function isTerminalState(arrayGame, depth, maxDepth) {
    return depth >= maxDepth || isBoardFull(arrayGame);
}

function getPrioritizedMoves(arrayGame, currentPlayer, opponent, ttBestMove) {
    const boardSize = arrayGame.length;
    const center = Math.floor(boardSize / 2);
    const moves = [];

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (arrayGame[i][j] !== 2) continue;

            if (ttBestMove && ttBestMove[0] === i && ttBestMove[1] === j) {
                moves.push({ move: [i, j], score: 1e9 });
                continue;
            }

            let score = 0;
            const distToCenter = Math.max(Math.abs(i - center), Math.abs(j - center));
            score += (boardSize - distToCenter) * 7;
            score += checkNearbyPieces(arrayGame, i, j);

            score += countThreats(arrayGame, i, j, currentPlayer) * 200;
            score += countThreats(arrayGame, i, j, opponent) * 150;

            moves.push({ move: [i, j], score });
        }
    }

    const topMovesCount = Math.max(Math.floor(boardSize * 1.5), 12);
    return moves
        .sort((a, b) => b.score - a.score)
        .slice(0, topMovesCount)
        .map(m => m.move);
}

function countThreats(arrayGame, row, col, player) {
    const lines = precomputedLines;
    if (!lines) return 0;
    let threats = 0;
    for (const line of lines) {
        const inLine = line.some(([x, y]) => x === row && y === col);
        if (!inLine) continue;
        let playerCount = 0, emptyCount = 0;
        for (const [x, y] of line) {
            if (arrayGame[x][y] === player) playerCount++;
            else if (arrayGame[x][y] === 2) emptyCount++;
        }
        if (playerCount === winningConnections - 1 && emptyCount >= 1) threats++;
        if (playerCount === winningConnections - 2 && emptyCount >= 2) threats += 0.5;
    }
    return threats;
}

function checkNearbyPieces(arrayGame, row, col) {
    const boardSize = arrayGame.length;
    const checkRange = Math.min(3, Math.floor(boardSize / 3));
    let proximityScore = 0;
    for (let di = -checkRange; di <= checkRange; di++) {
        for (let dj = -checkRange; dj <= checkRange; dj++) {
            const ni = row + di, nj = col + dj;
            if (ni >= 0 && ni < boardSize && nj >= 0 && nj < boardSize && arrayGame[ni][nj] !== 2) {
                proximityScore += (checkRange - Math.max(Math.abs(di), Math.abs(dj)) + 1) * 6;
            }
        }
    }
    return proximityScore;
}

function evaluateBoard(arrayGame, human, ai, precomputedLines) {
    if (gameStatus(arrayGame, ai))    return 100000;
    if (gameStatus(arrayGame, human)) return -100000;
    if (unavoidableWin(arrayGame, ai, human))    return 50000;
    if (unavoidableWin(arrayGame, human, ai))    return -50000;

    let score = 0;

    const humanForks = findForks(arrayGame, human, ai);
    const aiForks    = findForks(arrayGame, ai, human);
    score += aiForks.length  >= 2 ? 1000 * aiForks.length  : aiForks.length  * 500;
    score -= humanForks.length >= 2 ? 1500 * humanForks.length : humanForks.length * 500;

    score += evaluateAllLines(arrayGame, ai, human, precomputedLines);
    score += evaluateStrategicPositions(arrayGame, ai, human, arrayGame.length);
    score += evaluateThreats(arrayGame, ai, human, precomputedLines);

    return score;
}

function evaluateAllLines(arrayGame, ai, human, precomputedLines) {
    let score = 0;
    for (const line of precomputedLines) {
        const cells = line.map(([x, y]) => arrayGame[x][y]);
        score += evaluateLine(cells, ai, human);
    }
    return score;
}

function evaluateLine(line, ai, human) {
    const aiCount    = line.filter(c => c === ai).length;
    const humanCount = line.filter(c => c === human).length;
    const emptyCount = line.filter(c => c === 2).length;
    if (aiCount > 0 && humanCount > 0) return 0;
    if (aiCount > 0)    return Math.pow(5, aiCount) * (emptyCount + 1);
    if (humanCount > 0) return -Math.pow(5, humanCount) * (emptyCount + 1);
    return 0;
}

function evaluateStrategicPositions(arrayGame, ai, human, boardSize) {
    let score = 0;
    const center = Math.floor(boardSize / 2);
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const weight = boardSize <= 5 && i === center && j === center ? 100 : 0;
            if (arrayGame[i][j] === ai)    score += weight;
            if (arrayGame[i][j] === human) score -= weight;
        }
    }
    return score;
}

function evaluateThreats(arrayGame, ai, human, precomputedLines) {
    let score = 0;
    for (const line of precomputedLines) {
        let aiCount = 0, humanCount = 0, emptyCount = 0;
        for (const [x, y] of line) {
            const cell = arrayGame[x][y];
            if (cell === ai)        aiCount++;
            else if (cell === human) humanCount++;
            else                    emptyCount++;
        }
        if (humanCount === winningConnections - 1 && emptyCount === 1) score -= 60000;
        if (aiCount    === winningConnections - 1 && emptyCount === 1) score += 55000;
        if (aiCount    > 0 && humanCount === 0) score += Math.pow(4, aiCount) * emptyCount;
        if (humanCount > 0 && aiCount    === 0) score -= Math.pow(4, humanCount) * emptyCount;
    }
    return score;
}

function findForks(arrayGame, player, opponent) {
    const boardSize = arrayGame.length;
    const lines = precomputedLines || precomputeWinningLines(boardSize, winningConnections);
    const forks = [];

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (arrayGame[i][j] !== 2) continue;

            arrayGame[i][j] = player;
            let threatCount = 0;

            for (const line of lines) {
                let playerCount = 0, emptyCount = 0, blocked = false;
                for (const [x, y] of line) {
                    const v = arrayGame[x][y];
                    if (v === player)   playerCount++;
                    else if (v === 2)   emptyCount++;
                    else               { blocked = true; break; }
                }
                if (!blocked && playerCount === winningConnections - 1 && emptyCount > 0)
                    threatCount++;
            }

            arrayGame[i][j] = 2;
            if (threatCount >= 2) forks.push([i, j]);
        }
    }
    return forks;
}

function findInstantWin(arrayGame, player) {
    for (let i = 0; i < arrayGame.length; i++) {
        for (let j = 0; j < arrayGame[i].length; j++) {
            if (arrayGame[i][j] === 2) {
                arrayGame[i][j] = player;
                const win = gameStatus(arrayGame, player);
                arrayGame[i][j] = 2;
                if (win) return [i, j];
            }
        }
    }
    return false;
}

function findBestBlockingMove(arrayGame, human, ai) {
    const blockingMoves = findForks(arrayGame, human, ai);
    if (!blockingMoves || blockingMoves.length === 0) return null;

    let bestBlockingMove = null;
    let bestScore = -Infinity;
    for (const [i, j] of blockingMoves) {
        arrayGame[i][j] = ai;
        const score = evaluateBoard(arrayGame, human, ai, precomputedLines);
        arrayGame[i][j] = 2;
        if (score > bestScore) { bestScore = score; bestBlockingMove = [i, j]; }
    }
    return bestBlockingMove;
}

function unavoidableWin(arrayGame, player, opponent, _visited) {
    if (!_visited) _visited = new Set();

    const key = JSON.stringify(arrayGame);
    if (_visited.has(key)) return false;
    _visited.add(key);

    if (findInstantWin(arrayGame, player)) return true;
    const forks = findForks(arrayGame, player, opponent);
    if (forks.length > 0) return true;

    const forcingMoves = findInstantWin(arrayGame, opponent);
    if (!forcingMoves) return false;

    const responses = [];
    for (let i = 0; i < arrayGame.length; i++) {
        for (let j = 0; j < arrayGame[i].length; j++) {
            if (arrayGame[i][j] === 2) responses.push([i, j]);
        }
    }

    for (const [r, c] of responses) {
        const tmp = arrayGame.map(row => [...row]);
        tmp[r][c] = opponent;
        if (!unavoidableWin(tmp, player, opponent, _visited)) return false;
    }
    return true;
}

function isBoardFull(arrayGame) {
    return arrayGame.flat().every(cell => cell !== 2);
}

function getEmptyCells(board) {
    const cells = [];
    for (let i = 0; i < board.length; i++)
        for (let j = 0; j < board[i].length; j++)
            if (board[i][j] === 2) cells.push([i, j]);
    return cells;
}

function calculateMaxDepth(arrayGame, moveNumber) {
    switch (arrayGame.length) {
        case 3:  return 10;
        case 5:  return 10;
        case 9:  return 6 + Math.floor(moveNumber / 20);
        case 15: return 4 + Math.floor(moveNumber / 40);
        default: return 6;
    }
}

function handleOpeningMoves(arrayGame, moveNumber, ai, human) {
    const center = Math.floor(arrayGame.length / 2);
    const adjacent = [
        [center - 1, center],
        [center + 1, center],
        [center,     center + 1],
        [center,     center - 1],
    ];

    if (moveNumber === 0 || arrayGame[center][center] === 2) {
        return [center, center];
    }

    if (moveNumber === 2) {
        const valid = adjacent.filter(([r, c]) => arrayGame[r][c] === 2);
        if (valid.length > 0)
            return valid[Math.floor(Math.random() * valid.length)];
    }

    return null;
}
function smallGridCornerAttack(arrayGame, human, ai) {
    // Pokud jsou rohy (0, 0) a (2, 2) zabrané hráčem a pole (1, 2) je prázdné
    if (arrayGame[0][0] === human && arrayGame[2][2] === human && arrayGame[1][2] === 2) {
        return [1, 2];
    }
    // Pokud jsou rohy (0, 2) a (2, 0) zabrané hráčem a pole (1, 0) je prázdné
    else if (arrayGame[0][2] === human && arrayGame[2][0] === human && arrayGame[1][0] === 2) {
        return [1, 0];
    }
    return false;
}