const fs = require(`fs`);

function sii() {
    return `s${`i`.repeat(Math.floor(Math.random() * 5) + 1)}`;
}

let emotion_arr = [`!`, `~`, `!!`, `~~`, `.`, `,`];
let str = [];
let str2 = [];
let alllll = [];

for (let a = 0; a < 500; a++) {
    str = [];
    str2 = [];

    for (let i = 0; i < Math.floor(Math.random() * 500) + 10; i++) {
        str.push(`${sii()}${emotion_arr[Math.floor(Math.random() * emotion_arr.length)]}`);
    }

    for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
        str2.push(`${sii()}${emotion_arr[Math.floor(Math.random() * emotion_arr.length)]}`);
    }

    alllll = [...alllll, { input: str2.join(` `), output: str.join(` `) }];
}

fs.writeFileSync(`./sii.json`, JSON.stringify(alllll, null, 4));