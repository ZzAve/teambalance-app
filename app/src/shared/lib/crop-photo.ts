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
 * (ADR-0038). WebP where the browser can encode it; Safari cannot and silently hands back a PNG,
 * so it falls back to JPEG, which the server accepts too.
 */
export async function cropPhoto(src: string, area: CropArea): Promise<Blob> {
  const image = await loadImage(src)
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  canvas.getContext('2d')!.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, SIZE, SIZE)

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
