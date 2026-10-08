import { useEffect, useRef, useState } from 'react'
import Cropper from 'react-easy-crop'
import { cropPhoto, type CropArea } from '@shared/lib/crop-photo'
import { Button } from '@shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@shared/ui/dialog'

interface PhotoPickerProps {
  label: string
  disabled?: boolean
  /** The cropped 256×256 photo, ready to upload. */
  onPicked: (photo: Blob) => void
}

/**
 * A button that opens the file chooser, then a round crop with drag and zoom, and hands back the
 * square the member chose (ADR-0038). Cropping and scaling happen here in the browser, so the server
 * only ever receives a small finished image.
 */
export function PhotoPicker({ label, disabled, onPicked }: PhotoPickerProps) {
  const input = useRef<HTMLInputElement>(null)
  const [source, setSource] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [area, setArea] = useState<CropArea | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => () => {
    if (source) URL.revokeObjectURL(source)
  }, [source])

  const close = () => {
    setSource(null)
    setError(null)
    if (input.current) input.current.value = ''
  }

  const confirm = async () => {
    if (!source || !area) return
    try {
      onPicked(await cropPhoto(source, area))
      close()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read that image.')
    }
  }

  return (
    <>
      <input
        ref={input}
        type="file"
        accept="image/*"
        aria-label={label}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (!file) return
          setCrop({ x: 0, y: 0 })
          setZoom(1)
          setSource(URL.createObjectURL(file))
        }}
      />
      <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={() => input.current?.click()}>
        {label}
      </Button>

      <Dialog open={source !== null} onOpenChange={(open) => !open && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crop your photo</DialogTitle>
            <DialogDescription>Drag to move, and zoom to fit your face in the circle.</DialogDescription>
          </DialogHeader>
          {source && (
            <div className="relative h-72 w-full overflow-hidden rounded-md bg-muted">
              <Cropper
                image={source}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, pixels) => setArea(pixels)}
              />
            </div>
          )}
          <input
            type="range"
            aria-label="Zoom"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-primary"
          />
          {error && <p className="text-small text-red">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button type="button" disabled={!area} onClick={confirm}>
              Use photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
