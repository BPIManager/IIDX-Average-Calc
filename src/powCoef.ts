import fs from "fs";
const fss = fs.promises;
let diff: "11" | "12" = "11";

const openFile = async (path: string) => {
  try {
    const buff = await fss.readFile(path, "utf-8");
    return buff;
  } catch (e: any) {
    return "";
  }
};

const write = async (fileName: string, output: string) =>
  await fss.writeFile(fileName, output);

const loadCSV = async () => {
  const csv = await openFile("../inputs/result.csv");
  const split = csv.split("\n");
  const newData = [];
  for (let i = 0; i < split.length; ++i) {
    if (split[i].split(",").length === 0 || !split[i].split(",")[1]) {
      continue;
    }
    let title = split[i].split(",")[0].slice(1).slice(0, -1);
    const difficulty =
      title.indexOf("[A]") > 0 ? "4" : title.indexOf("[L]") > 0 ? "10" : "3";
    const powCoef = split[i].split(",")[1].slice(1).slice(0, -1);
    title = title.replace("[A]", "").replace("[H]", "").replace("[L]", "");
    newData.push({ title: title, difficulty: difficulty, powCoef: powCoef });
  }
  return newData;
};

const loadOrigData = async () => {
  const json = await openFile("../inputs/" + diff + ".json");
  return JSON.parse(json);
};

const loadAvg = async () => {
  const json = await openFile("../release/release" + diff + ".json");
  return JSON.parse(json);
};

const init = async () => {
  const newData = await loadCSV();
  const origData = await loadOrigData();
  const newAvgs = await loadAvg();
  for (let i = 0; i < origData.length; ++i) {
    const current = origData[i];
    const target = newData.find(
      (item) =>
        item.title === current.title && item.difficulty === current.difficulty
    );
    const m =
      current.difficulty === "4"
        ? "A"
        : current.difficulty === "10"
        ? "L"
        : "H";
    const newAvg = newAvgs.find(
      (item: any) => item.title === current.title + "[" + m + "]"
    );
    console.log(current, target, newAvg);
    if (target || diff === "11") {
      console.log(current, target);
      origData[i].wr = Number(origData[i].wr);
      origData[i].avg = Number(newAvg ? newAvg.avg : -1);
      origData[i].notes = Number(origData[i].notes);
      if (target && diff === "12") {
        origData[i].coef = Number(Number(target.powCoef).toFixed(6));
        /*
        if (Number(target.powCoef) > 0.88) {
        } else {
          origData[i].coef = 0.88;
        }
        */
      }
    }
  }
  await write("..\\final\\sp" + diff + ".json", JSON.stringify(origData));
};

init();
