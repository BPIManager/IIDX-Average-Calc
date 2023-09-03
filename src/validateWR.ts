import fs from "fs";
const fss = fs.promises;
let diff: "11" | "12" = "12";
const songRegExp = /\?|\:|\"|\*|\!|\'|\\|\//g;

const nameReplacer = (songName: string, decode: boolean = false) => {
  if (decode === false) {
    return songName
      .replace(/\?/g, "_q_")
      .replace(/\:/g, "_c_")
      .replace(/\"/g, "_d_")
      .replace(/\*/g, "_a_")
      .replace(/\!/g, "_e_")
      .replace(/\'/g, "_qo_")
      .replace(/\\/g, "_y_")
      .replace(/\//g, "_s_");
  }
  return songName
    .replace(/_q_/g, "?")
    .replace(/_c_/g, ":")
    .replace(/_d_/g, '"')
    .replace(/_a_/g, "*")
    .replace(/_e_/g, "!")
    .replace(/_qo_/g, "'")
    .replace(/_y_/g, "\\")
    .replace(/_s_/g, "/");
};

var folder = "C:\\GitHub\\IIDX-ScoresRepo\\" + diff + "\\";
var outputDir = "..\\res\\" + diff + "\\";

const openFile = async (path: string) => {
  try {
    const buff = await fss.readFile(path, "utf-8");
    return buff;
  } catch (e: any) {
    return "";
  }
};

const parser = async () => {
  let path = "";
  try {
    const songs: { [key: string]: number[] } = {};
    const files = fs.readdirSync(folder);
    for (let i = 0; i < files.length; ++i) {
      path = folder + files[i];
      const f = await openFile(path);
      if (typeof f !== "string") continue;
      const m = JSON.parse(f);
      Object.keys(m).map((item: string) => {
        if (!songs[item]) {
          songs[item] = [m[item]];
        } else {
          songs[item].push(m[item]);
        }
      });
    }
    return songs;
  } catch (e: any) {
    console.log(e, path);
    return {};
  }
};

const write = async (fileName: string, output: string) =>
  await fss.writeFile(fileName, output);

const readWR = async () => {
  const r = await openFile("..\\inputs\\" + diff + ".json");
  try {
    const m = JSON.parse(r);
    return m.reduce((group: any, item: any) => {
      if (!group) group = {};
      if (!item) return group;
      const d =
        item.difficulty === "3"
          ? "[H]"
          : item.difficulty === "4"
          ? "[A]"
          : "[L]";
      group[nameReplacer(item.title) + d] = Number(item.wr);
      return group;
    }, {});
  } catch (e) {
    console.log(e);
  }
};

const init = async () => {
  const input = await openFile("..\\final\\sp12.json");
  const wr = await openFile("..\\release\\release12.json");
  const inputarr = JSON.parse(input);
  const wrarr = JSON.parse(wr);
  const response = [];
  for (let i = 0; i < inputarr.length; ++i) {
    const item = inputarr[i];
    const writem = wrarr.find(
      (_item: any) =>
        _item.title ===
        (item.title === "Rave*it!! Rave*it!! "
          ? "Rave*it!! Rave*it!!"
          : item.title) +
          (item.difficulty === "3"
            ? "[H]"
            : item.difficulty === "4"
            ? "[A]"
            : "[L]")
    );
    if (!writem) {
      response.push(item);
    } else {
      if (writem.wr > item.wr) {
        console.log(
          "MODIFIED",
          writem.title,
          "NEW:",
          writem.wr,
          "OLD:",
          item.wr
        );
        item.wr = writem.wr;
      }
      if (writem.avg && item.avg === -1) {
        item.avg = writem.avg;
      }
      response.push(item);
    }
  }
  write("..\\final\\sp" + diff + ".json", JSON.stringify(response));
};

const rs = async () => {
  await init();
};

rs();
