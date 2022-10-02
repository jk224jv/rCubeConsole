import keypress from 'keypress'
import { stdout } from 'process'

/**
 *
 */
class RubicsCube {
  /**
   * Makes the cube.
   *
   * @param {object}filling - leave empty go get a solved rubics cube-
   */
  constructor (filling = this.fill()) {
    this.sides = JSON.parse(JSON.stringify(filling))
  }

  /**
   * Makes the key:value pares for the constructor. Do not call this unless you really really mean it.
   *
   * @returns {object}filling - mmmmm, vanilla!
   */
  fill () {
    const filling = []
    for (let color = 1; color < 8; color++) { // 0 = Black, 1 = Red, 2 = Green, 3 = Yellow, 4 = Blue, 5 = Magenta, 6 = Cyan, 7 = White.
      if (color === 5) { // skipp magenta
        color++
      }
      const side = {}
      for (let row = 0; row < 3; row++) {
        side[row] = [color, color, color]
      }
      filling.push(side)
    }
    return filling
  }

  /**
   * Create a copy of the instans provided.
   *
   * @param {object} source - insert your carboncopy source here.
   * @returns {object} new copy.
   */
  static from (source) {
    return new RubicsCube(source.sides)
  }

  /**
   * Shuffle the cube by randomly swapping out places in the matrix.
   */
  shuffle () {
    for (let i = 0; i < 999; i++) {
      const sourceSide = Math.floor(Math.random() * 6)
      const sourceRow = Math.floor(Math.random() * 3)
      const sourceCollumn = Math.floor(Math.random() * 3)

      const targetSide = Math.floor(Math.random() * 6)
      const targetRow = Math.floor(Math.random() * 3)
      const targetCollumn = Math.floor(Math.random() * 3)

      if (sourceSide !== targetSide || sourceRow !== targetRow || sourceCollumn !== targetCollumn) {
        const tempTargetSave = this.sides[targetSide][targetRow][targetCollumn]
        this.sides[targetSide][targetRow][targetCollumn] = this.sides[sourceSide][sourceRow][sourceCollumn]
        this.sides[sourceSide][sourceRow][sourceCollumn] = tempTargetSave
      }
    }
  }

  /**
   * Turns the matrix clockwise.
   *
   * @param {number} side - what side of the cube to turn? 0-5 [front,back,left,right,top,bottom]
   */
  clockwiseTurn (side = 0) {
    const tempCube = RubicsCube.from(theCube)
    this.sides[side][0][0] = tempCube.sides[side][2][0]
    this.sides[side][0][1] = tempCube.sides[side][1][0]
    this.sides[side][0][2] = tempCube.sides[side][0][0]

    this.sides[side][1][0] = tempCube.sides[side][2][1]
    this.sides[side][1][1] = tempCube.sides[side][1][1]
    this.sides[side][1][2] = tempCube.sides[side][0][1]

    this.sides[side][2][0] = tempCube.sides[side][2][2]
    this.sides[side][2][1] = tempCube.sides[side][1][2]
    this.sides[side][2][2] = tempCube.sides[side][0][2]


    // only do this part if not called to subliment other actions.
    if (side === 0) {
      this.sides[2][0][2] = tempCube.sides[5][0][2] // left right collum = bottom top row
      this.sides[2][1][2] = tempCube.sides[5][0][1]
      this.sides[2][2][2] = tempCube.sides[5][0][0]

      this.sides[4][2] = [tempCube.sides[2][0][2], tempCube.sides[2][2][2], tempCube.sides[2][2][2]] // top bottom row = left right collumn

      this.sides[3][0][0] = tempCube.sides[4][2][2] // right left collum = top bottom row
      this.sides[3][1][0] = tempCube.sides[4][2][1]
      this.sides[3][2][0] = tempCube.sides[4][2][0]

      this.sides[5][0] = [tempCube.sides[3][0][0], tempCube.sides[3][1][0], tempCube.sides[3][2][0]] // bottom top row = right left collum
    }
  }

  /**
   * Turns the matrix counterclockwise.
   *
   * @param {number} side - what side of the cube to turn? 0-5 [front,back,left,right,top,bottom]
   */
  counterClockwiseTurn (side = 0) {
    const tempCube = RubicsCube.from(theCube)
    this.sides[side][0][0] = tempCube.sides[side][0][2]
    this.sides[side][0][1] = tempCube.sides[side][1][2]
    this.sides[side][0][2] = tempCube.sides[side][1][2]

    this.sides[side][1][0] = tempCube.sides[side][0][1]
    this.sides[side][1][1] = tempCube.sides[side][1][1]
    this.sides[side][1][2] = tempCube.sides[side][2][1]

    this.sides[side][2][0] = tempCube.sides[side][0][0]
    this.sides[side][2][1] = tempCube.sides[side][1][0]
    this.sides[side][2][2] = tempCube.sides[side][2][0]

    // only do this part if not called to subliment other actions.
    if (side === 0) {
      this.sides[2][0][2] = tempCube.sides[4][2][2] // left right collum = top bottom row
      this.sides[2][1][2] = tempCube.sides[4][2][1]
      this.sides[2][2][2] = tempCube.sides[4][2][0]

      this.sides[4][2] = [tempCube.sides[2][0][0], tempCube.sides[3][1][0], tempCube.sides[3][2][0]] // top bottom row =  right left collumn

      this.sides[3][0][0] = tempCube.sides[5][0][2] // right left collum = bottom top row
      this.sides[3][1][0] = tempCube.sides[5][0][1]
      this.sides[3][2][0] = tempCube.sides[5][0][0]

      this.sides[5][0] = [tempCube.sides[3][0][2], tempCube.sides[3][1][2], tempCube.sides[3][2][2]] // bottom top row = left right collum
    }
  }

  /**
   * Returns a string of the cube.
   *
   * @param {number} x - margin-left:
   * @returns {string[]} returnString - for writing?
   */
  toString (x) {
    const squareDimentions = 9
    const returnStrings = []
    for (let topBoxStrings = 0; topBoxStrings < 2; topBoxStrings++) {
      const string = ''.padStart(x + 8 - topBoxStrings, ' ') + `/\x1b[4${this.sides[4][0][0]}m` + ''.padEnd(squareDimentions, ' ') + `\x1b[0m/\x1b[4${this.sides[4][0][1]}m` + ''.padEnd(squareDimentions, ' ') + `\x1b[0m/\x1b[4${this.sides[4][0][2]}m` + ''.padEnd(squareDimentions, ' ') + `\x1b[0m/\x1b[4${this.sides[3][0][2]}m` + ''.padEnd(topBoxStrings, ' ') + '\x1b[0m|\n'
      returnStrings.push(string)
    }
    returnStrings.push(''.padStart(x + 6, ' ') + `/\x1b[4${this.sides[4][0][0]}m` + ''.padEnd(squareDimentions, '_') + `\x1b[0m/\x1b[4${this.sides[4][0][1]}m` + ''.padEnd(squareDimentions, '_') + `\x1b[0m/\x1b[4${this.sides[4][0][2]}m` + ''.padEnd(squareDimentions, '_') + `\x1b[0m/\x1b[4${this.sides[3][0][2]}m` + ''.padEnd(2, ' ') + '\x1b[0m|\n')
    returnStrings.push(''.padStart(x + 5, ' ') + `/\x1b[4${this.sides[4][1][0]}m` + ''.padEnd(squareDimentions, ' ') + `\x1b[0m/\x1b[4${this.sides[4][1][1]}m` + ''.padEnd(squareDimentions, ' ') + `\x1b[0m/\x1b[4${this.sides[4][1][2]}m` + ''.padEnd(squareDimentions, ' ') + '\x1b[0m/\x1b[0m|' + `\x1b[4${this.sides[3][0][2]}m` + ''.padEnd(2, ' ') + '\x1b[0m|\n')
    returnStrings.push(''.padStart(x + 4, ' ') + `/\x1b[4${this.sides[4][1][0]}m` + ''.padEnd(squareDimentions, ' ') + `\x1b[0m/\x1b[4${this.sides[4][1][1]}m` + ''.padEnd(squareDimentions, ' ') + `\x1b[0m/\x1b[4${this.sides[4][1][2]}m` + ''.padEnd(squareDimentions, ' ') + `\x1b[0m/\x1b[4${this.sides[3][0][1]}m ` + `\x1b[0m|\x1b[4${this.sides[3][0][2]}m ` + '\x1b[0m/|\n')
    returnStrings.push(''.padStart(x + 3, ' ') + `/\x1b[4${this.sides[4][1][0]}m` + ''.padEnd(squareDimentions, '_') + `\x1b[0m/\x1b[4${this.sides[4][1][1]}m` + ''.padEnd(squareDimentions, '_') + `\x1b[0m/\x1b[4${this.sides[4][1][2]}m` + ''.padEnd(squareDimentions, '_') + `\x1b[0m/\x1b[4${this.sides[3][0][1]}m  ` + '\x1b[0m|/' + `\x1b[4${this.sides[3][1][2]}m ` + '\x1b[0m|\n')

    returnStrings.push(''.padStart(x + 2, ' ') + `/\x1b[4${this.sides[4][2][0]}m` + ''.padEnd(squareDimentions, ' ') + `\x1b[0m/\x1b[4${this.sides[4][2][1]}m` + ''.padEnd(squareDimentions, ' ') + `\x1b[0m/\x1b[4${this.sides[4][2][2]}m` + ''.padEnd(squareDimentions, ' ') + '\x1b[0m/\x1b[0m|' + `\x1b[4${this.sides[3][0][1]}m  ` + `\x1b[0m|\x1b[4${this.sides[3][1][2]}m  ` + '\x1b[0m|\n')
    returnStrings.push(''.padStart(x + 1, ' ') + `/\x1b[4${this.sides[4][2][0]}m` + ''.padEnd(squareDimentions, ' ') + `\x1b[0m/\x1b[4${this.sides[4][2][1]}m` + ''.padEnd(squareDimentions, ' ') + `\x1b[0m/\x1b[4${this.sides[4][2][2]}m` + ''.padEnd(squareDimentions, ' ') + `\x1b[0m/\x1b[4${this.sides[3][0][0]}m ` + '\x1b[0m|' + `\x1b[4${this.sides[3][0][1]}m ` + `\x1b[0m/|\x1b[4${this.sides[3][1][2]}m  \x1b[0m|\n`)
    returnStrings.push(''.padStart(x + 0, ' ') + `/\x1b[4${this.sides[4][2][0]}m` + ''.padEnd(squareDimentions, '_') + `\x1b[0m/\x1b[4${this.sides[4][2][1]}m` + ''.padEnd(squareDimentions, '_') + `\x1b[0m/\x1b[4${this.sides[4][2][2]}m` + ''.padEnd(squareDimentions, '_') + `\x1b[0m/\x1b[4${this.sides[3][0][0]}m  ` + '\x1b[0m|/' + `\x1b[4${this.sides[3][1][1]}m ` + `\x1b[0m|\x1b[4${this.sides[3][1][2]}m \x1b[0m/|\n`)

    returnStrings.push(''.padStart(x, ' ') + '|' + `\x1b[4${this.sides[0][0][0]}m` + ''.padEnd(squareDimentions, ' ') + `\x1b[0m|\x1b[4${this.sides[0][0][1]}m` + ''.padEnd(squareDimentions, ' ') + `\x1b[0m|\x1b[4${this.sides[0][0][2]}m` + ''.padEnd(squareDimentions, ' ') + '\x1b[0m|' + `\x1b[4${this.sides[3][0][0]}m  ` + '\x1b[0m|' + `\x1b[4${this.sides[3][1][1]}m  ` + `\x1b[0m|/\x1b[4${this.sides[3][2][2]}m \x1b[0m|\n`)
    returnStrings.push(''.padStart(x, ' ') + '|' + `\x1b[4${this.sides[0][0][0]}m` + ''.padEnd(squareDimentions, ' ') + `\x1b[0m|\x1b[4${this.sides[0][0][1]}m` + ''.padEnd(squareDimentions, ' ') + `\x1b[0m|\x1b[4${this.sides[0][0][2]}m` + ''.padEnd(squareDimentions, ' ') + '\x1b[0m|' + `\x1b[4${this.sides[3][0][0]}m ` + '\x1b[0m/|' + `\x1b[4${this.sides[3][1][1]}m  ` + `\x1b[0m|\x1b[4${this.sides[3][2][2]}m  \x1b[0m|\n`)
    returnStrings.push(''.padStart(x, ' ') + '|' + `\x1b[4${this.sides[0][0][0]}m` + ''.padEnd(squareDimentions, '_') + `\x1b[0m|\x1b[4${this.sides[0][0][1]}m` + ''.padEnd(squareDimentions, '_') + `\x1b[0m|\x1b[4${this.sides[0][0][2]}m` + ''.padEnd(squareDimentions, '_') + '\x1b[0m|/' + `\x1b[4${this.sides[3][1][0]}m ` + '\x1b[0m|' + `\x1b[4${this.sides[3][1][1]}m ` + `\x1b[0m/|\x1b[4${this.sides[3][2][2]}m  \x1b[0m|\n`)

    returnStrings.push(''.padStart(x, ' ') + '|' + `\x1b[4${this.sides[0][1][0]}m` + ''.padEnd(squareDimentions, ' ') + `\x1b[0m|\x1b[4${this.sides[0][1][1]}m` + ''.padEnd(squareDimentions, ' ') + `\x1b[0m|\x1b[4${this.sides[0][1][2]}m` + ''.padEnd(squareDimentions, ' ') + '\x1b[0m|' + `\x1b[4${this.sides[3][1][0]}m  ` + '\x1b[0m|/' + `\x1b[4${this.sides[3][2][1]}m ` + `\x1b[0m|\x1b[4${this.sides[3][2][2]}m \x1b[0m/\n`)
    returnStrings.push(''.padStart(x, ' ') + '|' + `\x1b[4${this.sides[0][1][0]}m` + ''.padEnd(squareDimentions, ' ') + `\x1b[0m|\x1b[4${this.sides[0][1][1]}m` + ''.padEnd(squareDimentions, ' ') + `\x1b[0m|\x1b[4${this.sides[0][1][2]}m` + ''.padEnd(squareDimentions, ' ') + '\x1b[0m|' + `\x1b[4${this.sides[3][1][0]}m ` + '\x1b[0m/|' + `\x1b[4${this.sides[3][2][1]}m  ` + '\x1b[0m|/\n')
    returnStrings.push(''.padStart(x, ' ') + '|' + `\x1b[4${this.sides[0][1][0]}m` + ''.padEnd(squareDimentions, '_') + `\x1b[0m|\x1b[4${this.sides[0][1][1]}m` + ''.padEnd(squareDimentions, '_') + `\x1b[0m|\x1b[4${this.sides[0][1][2]}m` + ''.padEnd(squareDimentions, '_') + '\x1b[0m|/' + `\x1b[4${this.sides[3][2][0]}m ` + '\x1b[0m|' + `\x1b[4${this.sides[3][2][1]}m  ` + '\x1b[0m/\n')

    returnStrings.push(''.padStart(x, ' ') + '|' + `\x1b[4${this.sides[0][2][0]}m` + ''.padEnd(squareDimentions, ' ') + `\x1b[0m|\x1b[4${this.sides[0][2][1]}m` + ''.padEnd(squareDimentions, ' ') + `\x1b[0m|\x1b[4${this.sides[0][2][2]}m` + ''.padEnd(squareDimentions, ' ') + '\x1b[0m|' + `\x1b[4${this.sides[3][2][0]}m  ` + '\x1b[0m|' + `\x1b[4${this.sides[3][2][1]}m ` + '\x1b[0m/\n')
    returnStrings.push(''.padStart(x, ' ') + '|' + `\x1b[4${this.sides[0][2][0]}m` + ''.padEnd(squareDimentions, ' ') + `\x1b[0m|\x1b[4${this.sides[0][2][1]}m` + ''.padEnd(squareDimentions, ' ') + `\x1b[0m|\x1b[4${this.sides[0][2][2]}m` + ''.padEnd(squareDimentions, ' ') + '\x1b[0m|' + `\x1b[4${this.sides[3][2][0]}m  ` + '\x1b[0m|' + '\x1b[0m/\n')
    returnStrings.push(''.padStart(x, ' ') + '|' + `\x1b[4${this.sides[0][2][0]}m` + ''.padEnd(squareDimentions, '_') + `\x1b[0m|\x1b[4${this.sides[0][2][1]}m` + ''.padEnd(squareDimentions, '_') + `\x1b[0m|\x1b[4${this.sides[0][2][2]}m` + ''.padEnd(squareDimentions, '_') + '\x1b[0m|' + `\x1b[4${this.sides[3][2][0]}m ` + '\x1b[0m/\n')
    return returnStrings
  }

  /**
   * Rotate a row of the cube.
   *
   * @param {number} row - what row to rotate.
   * @param {boolean} direction - clockwise = true, counterclockwise = false.
   */
  rotateRow (row, direction) {
    const tempCube = RubicsCube.from(theCube)
    if (direction) {
      this.sides[0][row] = tempCube.sides[3][row]
      this.sides[3][row] = tempCube.sides[1][row]
      this.sides[1][row] = tempCube.sides[2][row]
      this.sides[2][row] = tempCube.sides[0][row]
      if (row === 0) {
        this.clockwiseTurn(4)
      }

      if (row === 2) {
        this.clockwiseTurn(5)
      }
    } else {
      this.sides[0][row] = tempCube.sides[2][row]
      this.sides[3][row] = tempCube.sides[0][row]
      this.sides[1][row] = tempCube.sides[3][row]
      this.sides[2][row] = tempCube.sides[1][row]
      if (row === 0) {
        this.counterClockwiseTurn(4)
      }

      if (row === 2) {
        this.clockwiseTurn(5)
      }
    }
  }

  /**
   * Rotate a row of the cube.
   *
   * @param {number} collumn - what row to rotate.
   * @param {boolean} direction - true = up, false = down.
   */
  rotateCollumn (collumn, direction) {
    const tempCube = RubicsCube.from(theCube)
    if (direction) {
      for (let row = 0; row < 3; row++) {
        this.sides[0][row][collumn] = tempCube.sides[5][row][collumn]
        this.sides[5][row][collumn] = tempCube.sides[1][row][collumn]
        this.sides[1][row][collumn] = tempCube.sides[4][row][collumn]
        this.sides[4][row][collumn] = tempCube.sides[0][row][collumn]
      }
      if (collumn === 0) {
        this.counterClockwiseTurn(2)
      }

      if (collumn === 2) {
        this.clockwiseTurn(3)
      }
    } else {
      for (let row = 0; row < 3; row++) {
        this.sides[0][row][collumn] = tempCube.sides[4][row][collumn]
        this.sides[4][row][collumn] = tempCube.sides[1][row][collumn]
        this.sides[1][row][collumn] = tempCube.sides[5][row][collumn]
        this.sides[5][row][collumn] = tempCube.sides[0][row][collumn]
      }
      if (collumn === 0) {
        this.clockwiseTurn(2)
      }

      if (collumn === 2) {
        this.counterClockwiseTurn(3)
      }
    }
  }

  /**
   * Turn cube up or down.
   *
   * @param {boolean} direction - true = up, false = down.
   */
  flippCubeY (direction) {
    for (let cheakyHack = 0; cheakyHack < 3; cheakyHack++) {
      this.rotateCollumn(cheakyHack, direction)
    }
  }

  /**
   * Turn cube left or right.
   *
   * @param {boolean} direction - clockwise = true, counterclockwise = false.
   */
  flippCubeX (direction) {
    for (let cheakyHack = 0; cheakyHack < 3; cheakyHack++) {
      this.rotateRow(cheakyHack, direction)
    }
  }
}

/**
 *Write on exit dialog. Credits.
 */
function writeExitDialog () {
  console.clear()
  const exitDialog = ['Rubics Cube', '', '════════════════════════════════════════', '', 'the class\'ic game', 'by', 'Jimmy Karlsson <jk224jv>', 'codesmith apprentice freshman grade', 'Linnéuniversitetet', 'Holy Terra', '', '════════════════════════════════════════', '', '++ Praise the Omnissiah! ++']
  for (let i = 0; i < exitDialog.length; i++) {
    stdout.cursorTo(Math.floor((stdout.columns / 2) - (exitDialog[i].length / 2)), Math.floor((stdout.rows / 2) - Math.floor(exitDialog.length / 2) + i))
    stdout.write(exitDialog[i])
  }
  // at end of program return console settings to normal
  console.log('\x1b[0m')
}

/**
 * Writes cube and instructions to screen.
 *
 * @param {number} x - x,cordinate.
 * @param {number} y - y,cordinate.
 */
function write (x, y) {
  console.clear()
  stdout.cursorTo(x, y)
  const cubeStrings = theCube.toString(15)

  for (let index = 0; index < cubeStrings.length; index++) {
    stdout.cursorTo(x, y + 2 + index)
    stdout.write(cubeStrings[index])
  }
  stdout.cursorTo(x, y + 12)
  stdout.write('e ◄-- --► u')

  stdout.cursorTo(x, y + 15)
  stdout.write('d ◄-- --► j')

  stdout.cursorTo(x, y + 18)
  stdout.write('c ◄-- --► m')

  const col1 = 'r ▲|▼ v'
  const col2 = 't ▲|▼ b'
  const col3 = 'y ▲|▼ n'
  for (let i = 0; i < col1.length; i++) {
    stdout.cursorTo(x + 20, y + 21 + i)
    stdout.write(col1.charAt(i))
  }
  for (let i = 0; i < col1.length; i++) {
    stdout.cursorTo(x + 30, y + 21 + i)
    stdout.write(col2.charAt(i))
  }
  for (let i = 0; i < col1.length; i++) {
    stdout.cursorTo(x + 40, y + 21 + i)
    stdout.write(col3.charAt(i))
  }

  stdout.cursorTo(x, y + 2)
  stdout.write('arrows, turns the cube')
  stdout.cursorTo(x, y + 3)
  stdout.write('Ctrl+q > Quit')

  stdout.cursorTo(x + 5, y + 22)
  stdout.write('╔◄╗')
  stdout.cursorTo(x + 5, y + 23)
  stdout.write('╚►╝')
  stdout.cursorTo(x + 2, y + 24)
  stdout.write('g')

  stdout.cursorTo(x + 55, y + 22)
  stdout.write('╔◄╗')
  stdout.cursorTo(x + 55, y + 23)
  stdout.write('╚►╝')
  stdout.cursorTo(x + 57, y + 24)
  stdout.write('h')
}

const theCube = new RubicsCube()
theCube.shuffle()
write(20, 0)
keypress(process.stdin)
// Listen for keypress event
process.stdin.on('keypress', function (ch, key) { // I honestly dont know what the ch is doing there... but it doesnt work without it.
// Check for operation keys.
  if (key && key.ctrl && key.name === 'q') {
    process.stdin.pause()
    writeExitDialog()
  }
  switch (key.name) {
    case 'e':
      theCube.rotateRow(0, true)
      write(20, 0)
      break
    case 'u':
      theCube.rotateRow(0, false)
      write(20, 0)
      break
    case 'd':
      theCube.rotateRow(1, true)
      write(20, 0)
      break
    case 'j':
      theCube.rotateRow(1, false)
      write(20, 0)
      break
    case 'c':
      theCube.rotateRow(2, true)
      write(20, 0)
      break
    case 'm':
      theCube.rotateRow(2, false)
      write(20, 0)
      break
    case 'g':
      theCube.counterClockwiseTurn(0)
      write(20, 0)
      break
    case 'h':
      theCube.clockwiseTurn(0)
      write(20, 0)
      break
    case 'r':
      theCube.rotateCollumn(0, true)
      write(20, 0)
      break
    case 'v':
      theCube.rotateCollumn(0, false)
      write(20, 0)
      break
    case 't':
      theCube.rotateCollumn(1, true)
      write(20, 0)
      break
    case 'b':
      theCube.rotateCollumn(1, false)
      write(20, 0)
      break
    case 'y':
      theCube.rotateCollumn(2, true)
      write(20, 0)
      break
    case 'n':
      theCube.rotateCollumn(2, false)
      write(20, 0)
      break
    case 'left':
      theCube.flippCubeX(true)
      write(20, 0)
      break
    case 'right':
      theCube.flippCubeX(false)
      write(20, 0)
      break
    case 'up':
      theCube.flippCubeY(true)
      write(20, 0)
      break
    case 'down':
      theCube.flippCubeY(false)
      write(20, 0)
      break
    default:
      break
  }
})
process.stdin.setRawMode(true)
process.stdin.resume()

stdout.cursorTo(0, stdout.rows)
