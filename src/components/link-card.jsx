import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Copy, Download, Trash } from 'lucide-react'
import useFetch from '@/hooks/use-fetch'
import { deleteUrls } from '@/db/apiUrls'
import { BeatLoader } from 'react-spinners'
import { QRCode } from 'react-qrcode-logo'

const LinkCard = ({ url, fetchUrls }) => {

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrls, url?.id)

  // Function to download the QR code as an image
  const downloadImage = async () => {
    const canvas = document.querySelector(`#qr-${url?.id} canvas`)
    if (!canvas) return alert("QR not ready yet")

    const dataUrl = canvas.toDataURL("image/png")
    const anchor = document.createElement('a')
    anchor.href = dataUrl
    anchor.download = `${url?.title || 'qr'}.png`

    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }

  return (
    <div className='flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg'>
      
      <div id={`qr-${url?.id}`} className='self-start bg-white p-1 rounded'>
        <QRCode
          value={url?.original_url}
          size={128}
          ecLevel="H"
          quietZone={8}
          logoWidth={20}
        />
      </div>

      <Link to={`/link/${url?.id}`} className='flex flex-col flex-1'>
        <span className='text-3xl font-extrabold cursor-pointer'>
          {url?.title}
        </span>
        <span className='text-2xl text-blue-400 font-bold hover:underline cursor-pointer'>
          https://trimmer1.vercel.app/{url?.custom_url || url?.short_url}
        </span>
        <span className='flex items-center gap-1 hover:underline cursor-pointer'>
          {url?.original_url}
        </span>
        <span className='flex items-end font-extralight text-sm flex-1'>
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>

      <div className='flex gap-2'>
        <Button
          variant="ghost"
          onClick={() => navigator.clipboard.writeText(`https://trimmer1.vercel.app/${url?.short_url}`)}
        >
          <Copy />
        </Button>

        <Button
          variant="ghost"
          onClick={downloadImage}
        >
          <Download />
        </Button>

        <Button
          variant="ghost"
          onClick={() => fnDelete().then(() => fetchUrls())}
        >
          {loadingDelete ? <BeatLoader size={5} color='white' /> : <Trash />}
        </Button>
      </div>
    </div>
  )
}

export default LinkCard
