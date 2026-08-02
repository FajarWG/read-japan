import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const DATA_DIR = path.join(process.cwd(), "data");

const KANJIDIC2_GZ_URL = "https://www.edrdg.org/kanjidic/kanjidic2.xml.gz";
const JMDICT_GZ_URL = "https://www.edrdg.org/pub/Nihongo/JMdict_e.gz";
const KANJIVG_ZIP_URL = "https://github.com/KanjiVG/kanjivg/archive/refs/heads/master.zip";

async function main() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // 1. KANJIDIC2
  const kanjidicXml = path.join(DATA_DIR, "kanjidic2.xml");
  const kanjidicGz = path.join(DATA_DIR, "kanjidic2.xml.gz");
  if (!fs.existsSync(kanjidicXml)) {
    console.log("--> Downloading KANJIDIC2 using curl...");
    execSync(`curl -L --fail --retry 3 -o "${kanjidicGz}" "${KANJIDIC2_GZ_URL}"`, { stdio: "inherit" });
    console.log("Decompressing kanjidic2.xml.gz...");
    execSync(`gzip -df "${kanjidicGz}"`, { stdio: "inherit" });
    console.log(`Saved KANJIDIC2 to ${kanjidicXml}`);
  } else {
    console.log(`KANJIDIC2 already exists at ${kanjidicXml}`);
  }

  // 2. JMdict
  const jmdictXml = path.join(DATA_DIR, "JMdict_e.xml");
  const jmdictGz = path.join(DATA_DIR, "JMdict_e.gz");
  if (!fs.existsSync(jmdictXml)) {
    console.log("--> Downloading JMdict using curl...");
    execSync(`curl -L --fail --retry 3 -o "${jmdictGz}" "${JMDICT_GZ_URL}"`, { stdio: "inherit" });
    console.log("Decompressing JMdict_e.gz...");
    execSync(`gzip -df "${jmdictGz}"`, { stdio: "inherit" });
    console.log(`Saved JMdict to ${jmdictXml}`);
  } else {
    console.log(`JMdict already exists at ${jmdictXml}`);
  }

  // 3. KanjiVG
  const kanjivgDir = path.join(DATA_DIR, "kanjivg");
  const kanjivgZip = path.join(DATA_DIR, "kanjivg.zip");
  if (!fs.existsSync(kanjivgDir)) {
    console.log("--> Downloading KanjiVG master zip using curl...");
    execSync(`curl -L --fail --retry 3 -o "${kanjivgZip}" "${KANJIVG_ZIP_URL}"`, { stdio: "inherit" });
    console.log("Extracting KanjiVG zip...");
    execSync(`unzip -q -o "${kanjivgZip}" -d "${DATA_DIR}"`);
    const extractedMasterDir = path.join(DATA_DIR, "kanjivg-master");
    if (fs.existsSync(extractedMasterDir)) {
      fs.renameSync(extractedMasterDir, kanjivgDir);
    }
    if (fs.existsSync(kanjivgZip)) {
      fs.unlinkSync(kanjivgZip);
    }
    console.log(`KanjiVG extracted to ${kanjivgDir}`);
  } else {
    console.log(`KanjiVG directory already exists at ${kanjivgDir}`);
  }

  console.log("\nAll datasets downloaded and decompressed successfully!");
}

main().catch((err) => {
  console.error("Error downloading datasets:", err);
  process.exit(1);
});
