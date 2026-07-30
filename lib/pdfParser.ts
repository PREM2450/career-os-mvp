import PDFParser from "pdf2json";

export function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(undefined, true);

    pdfParser.on("pdfParser_dataError", (err: any) => {
      reject(err.parserError);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      let text = "";

      for (const page of pdfData.Pages) {
        for (const item of page.Texts) {
          for (const run of item.R) {
            let value = run.T ?? "";

try {
  value = decodeURIComponent(value);
} catch {
  // Agar decode fail ho to original text hi use karo
}

text += value + " ";
          }
        }
        text += "\n";
      }

      resolve(text);
    });

    pdfParser.parseBuffer(buffer);
  });
}