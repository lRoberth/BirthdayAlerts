const color = {};
color[0] = "\x1b[0m"; // Reset
color[1] = "\x1b[1m"; // Bright
color[2] = "\x1b[2m"; // Dim
color[3] = "\x1b[4m"; // Underscore
color[4] = "\x1b[5m"; // Blink
color[5] = "\x1b[7m"; // Reverse
color[6] = "\x1b[8m"; // Hidden
color[7] = "\x1b[30m"; // FgBlack 
color[8] = "\x1b[31m"; // FgRed 
color[9] = "\x1b[32m"; // FgGreen 
color[10] = "\x1b[33m"; // FgYellow 
color[11] = "\x1b[34m"; // FgBlue 
color[12] = "\x1b[35m"; // FgMagenta 
color[13] = "\x1b[36m"; // FgCyan 
color[14] = "\x1b[37m"; // FgWhite 
color[15] = "\x1b[40m"; // BgBlack 
color[16] = "\x1b[41m"; // BgRed 
color[17] = "\x1b[42m"; // BgGreen 
color[18] = "\x1b[43m"; // BgYellow 
color[19] = "\x1b[44m"; // BgBlue 
color[20] = "\x1b[45m"; // BgMagenta 
color[21] = "\x1b[46m"; // BgCyan 
color[22] = "\x1b[47m"; // BgWhite 
var setColor = function(code) {
    process.stdout.write(color[code]);
}

var getColor = function(code) {
    return color[code];
}

module.exports = {
    setColor,
    getColor
};