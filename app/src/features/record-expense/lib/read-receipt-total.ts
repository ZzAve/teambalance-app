import { receiptTotal } from './receipt-total'

// Text recognition (Tesseract) runs in the browser, in a web worker: the photo never leaves the device for
// it. The engine and the language data are served by the app itself under /ocr (see vite.config.ts) and
// are fetched when the first photo is read, about 9 MB once; the language data is then kept in IndexedDB.
const OCR_PATH = `${import.meta.env.BASE_URL}ocr`
// Receipts in the Netherlands are Dutch; the English data reads the digits of some prints better.
const LANGUAGES = ['nld', 'eng']
// Text recognition reads small print badly: a photo is enlarged until its long side is this many pixels,
// at most 2.5 times.
const READING_EDGE = 2000
const MAX_ENLARGEMENT = 2.5

/** The total on the receipt in the photo, in euro cents; null when none is found. Rejects when the text recognition cannot be loaded or run. */
export async function readReceiptTotal(receipt: Blob): Promise<number | null> {
  const [{ createWorker }, image] = await Promise.all([import('tesseract.js'), enlarged(receipt)])
  const worker = await createWorker(LANGUAGES, 1, {
    workerPath: `${OCR_PATH}/worker.min.js`,
    corePath: OCR_PATH,
    langPath: OCR_PATH,
  })
  try {
    const { data } = await worker.recognize(image)
    return receiptTotal(data.text)
  } finally {
    await worker.terminate()
  }
}

async function enlarged(photo: Blob): Promise<HTMLCanvasElement> {
  const bitmap = await createImageBitmap(photo)
  const scale = Math.min(MAX_ENLARGEMENT, Math.max(1, READING_EDGE / Math.max(bitmap.width, bitmap.height)))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return canvas
}
