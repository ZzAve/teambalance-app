/** A square area of the source image, in its natural pixels, as the cropper reports it. */
export interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

const SIZE = 256
const QUALITY = 0.85

/**
 * Cuts [area] out of the image at [src] and scales it to the 256×256 photo the server stores
 * (ADR-0038), encoded as WebP or JPEG.
 */
export async function cropPhoto(src: string, area: CropArea): Promise<Blob> {
  const image = await loadImage(src)
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  canvas.getContext('2d')!.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, SIZE, SIZE)
  return encode(canvas)
}

const RECEIPT_EDGE = 1600

/**
 * Scales the picked file down to at most 1600 px on its long side, uncropped, and encodes it the
 * same way as a photo, so a receipt photo straight from a phone camera fits the server's 500 KB limit.
 */
export async function shrinkImage(file: Blob): Promise<Blob> {
  const src = URL.createObjectURL(file)
  try {
    const image = await loadImage(src)
    const { width, height } = fitWithin(image.naturalWidth, image.naturalHeight, RECEIPT_EDGE)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d')!.drawImage(image, 0, 0, width, height)
    return await encode(canvas)
  } finally {
    URL.revokeObjectURL(src)
  }
}

/** The size that fits [width]×[height] within [maxEdge] on both sides, never scaled up. */
export function fitWithin(width: number, height: number, maxEdge: number) {
  const scale = Math.min(1, maxEdge / Math.max(width, height))
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) }
}

// WebP where the browser can encode it; Safari cannot and silently hands back a PNG, so it falls back to JPEG.
async function encode(canvas: HTMLCanvasElement): Promise<Blob> {
  const webp = await toBlob(canvas, 'image/webp')
  return webp.type === 'image/webp' ? webp : toBlob(canvas, 'image/jpeg')
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Could not read that image.'))
    image.src = src
  })
}

function toBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not encode the photo.'))), type, QUALITY),
  )
}
