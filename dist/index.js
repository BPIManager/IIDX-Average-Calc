"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const fss = fs_1.default.promises;
let diff = "12";
const songRegExp = /\?|\:|\"|\*|\!|\'|\\|\//g;
const nameReplacer = (songName, decode = false) => {
    if (decode === false) {
        return songName.replace(/\?/g, "_q_").replace(/\:/g, "_c_").replace(/\"/g, "_d_").replace(/\*/g, "_a_").replace(/\!/g, "_e_").replace(/\'/g, "_qo_").replace(/\\/g, "_y_").replace(/\//g, "_s_");
    }
    return songName.replace(/_q_/g, "?").replace(/_c_/g, ":").replace(/_d_/g, "\"").replace(/_a_/g, "*").replace(/_e_/g, "!").replace(/_qo_/g, "'").replace(/_y_/g, "\\").replace(/_s_/g, "/");
};
var folder = "C:\\Users\\koro1\\Documents\\GitHub\\IIDX-ScoresRepo\\" + diff + "\\";
var outputDir = "..\\res\\" + diff + "\\";
const openFile = async (path) => {
    try {
        const buff = await fss.readFile(path, "utf-8");
        return buff;
    }
    catch (e) {
        return "";
    }
};
const parser = async () => {
    let path = "";
    try {
        const songs = {};
        const files = fs_1.default.readdirSync(folder);
        for (let i = 0; i < files.length; ++i) {
            path = folder + files[i];
            const f = await openFile(path);
            if (typeof f !== "string")
                continue;
            const m = JSON.parse(f);
            Object.keys(m).map((item) => {
                if (!songs[item]) {
                    songs[item] = [m[item]];
                }
                else {
                    songs[item].push(m[item]);
                }
            });
        }
        return songs;
    }
    catch (e) {
        console.log(e, path);
        return {};
    }
};
const write = async (fileName, output) => await fss.writeFile(fileName, output);
const init = async () => {
    const res = await parser();
    Object.keys(res).map(async (song) => {
        const rank = res[song];
        if (songRegExp.test(song)) {
            console.log(song);
        }
        await write(outputDir + nameReplacer(song) + ".json", JSON.stringify(rank.sort((a, b) => b - a)));
    });
};
const readWR = async () => {
    const r = await openFile("..\\inputs\\" + diff + ".json");
    try {
        const m = JSON.parse(r);
        return m.reduce((group, item) => {
            if (!group)
                group = {};
            if (!item)
                return group;
            const d = item.difficulty === "3" ? "[H]" : item.difficulty === "4" ? "[A]" : "[L]";
            group[nameReplacer(item.title) + d] = Number(item.wr);
            return group;
        }, {});
    }
    catch (e) {
        console.log(e);
    }
};
const readMax = async () => {
    const r = await openFile("..\\inputs\\" + diff + ".json");
    const m = JSON.parse(r);
    return m.reduce((group, item) => {
        if (!group)
            group = {};
        if (!item)
            return group;
        const d = item.difficulty === "3" ? "[H]" : item.difficulty === "4" ? "[A]" : "[L]";
        group[nameReplacer(item.title) + d] = Number(item.notes) * 2;
        return group;
    }, {});
};
const rs = async () => {
    await init();
    const files = fs_1.default.readdirSync(outputDir);
    const wrs = await readWR();
    const maxes = await readMax();
    console.log(files);
    let res = [];
    for (let i = 0; i < files.length; ++i) {
        const f = files[i];
        let songName = f.replace(".json", "");
        const fullPath = outputDir + f;
        const r = await openFile(fullPath);
        const wr = wrs[songName];
        const max = maxes[songName] || 0;
        if (!wr) {
            console.log(songName + ": WR Not found");
        }
        const m = JSON.parse(r);
        const sum = m.reduce((sum, item) => sum += Number(item), 0);
        const wrLogic = () => {
            if (m.length > 0) {
                return wr > m[0] ? wr : m[0];
            }
            else {
                return wr || 0;
            }
        };
        const mGet = (rank) => {
            if (m.length > rank) {
                return m[rank];
            }
            return 0;
        };
        const indexOf = (T) => songName.indexOf(`[${T}]`) > -1;
        const _diff = indexOf("H") ? 3 : indexOf("A") ? 4 : 10;
        res.push({ title: nameReplacer(songName, true), difficulty: _diff, wr: wrLogic(),
            avg: Math.floor(sum / m.length), max: max,
            playerSum: m.length });
        /*
  
          BPI100:mGet(1),BPI90:mGet(2),BPI80:mGet(5),BPI70:mGet(11),BPI60:mGet(23),BPI50:mGet(51),
          BPI40:mGet(113),BPI30:mGet(249),BPI20:mGet(547),BPI10:mGet(1203),
  
        ,max:max
        */
    }
    await write("..\\release\\" + "release" + diff + ".json", JSON.stringify(res));
    //console.log(files);
};
rs();
