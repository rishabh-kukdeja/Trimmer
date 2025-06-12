import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DeviceStats from "@/components/device-stats";
import Location from "@/components/location-stats";
import { Button } from '@/components/ui/button';
import { UrlState } from '@/context';
import { getClicksForUrl } from '@/db/apiClicks';
import { deleteUrls, getUrl } from '@/db/apiUrls';
import useFetch from '@/hooks/use-fetch';
import { Copy, Download, LinkIcon, Trash } from 'lucide-react';
import React, { useEffect } from 'react'
import { QRCode } from 'react-qrcode-logo';
import { useNavigate, useParams } from 'react-router-dom'
import { BarLoader, BeatLoader } from 'react-spinners';

const Link = () => {

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

  const {id} = useParams();
  const {user} = UrlState();
  const navigate = useNavigate();

 const {
  loading,
  data: url,
  fn,
  error,
} = useFetch(() => getUrl(id, user?.id));

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl,id);

  const {loading: loadingDelete, fn: fnDelete} = useFetch(deleteUrls, id);

  useEffect(() => {
    fn();
    fnStats();
  }, []);

  useEffect(() => {
    if (error) {
      console.error("Redirecting due to error:", error);
      navigate("/dashboard");
    }
  }, [error, navigate]);

  let link="";
  if(url){
    link = url?.custom_url ? url?.custom_url : url.short_url;
  }
  

  return <>
      {(loading || loadingStats) && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}
      <div className='flex flex-col gap-8 sm:flex-row justify-between'>
        <div className='flex flex-col items-start gap-8 rounded-lg sm:w-2/5'>
          <span className='text-6xl font-extrabold hover:underline cursor-pointer'>
            {url?.title}
            </span>
          <a 
          href={`https://trimmer1.vercel.app/${link}`}
          target="_blank"
          className='text-3xl sm:text-4xl text-blue-400 font-bold hover:underline'
          >https://trimmer1.vercel.app/{link}
          
          </a>

          <a 
          href={url?.original_url} 
          target="_blank"
          className="flex items-center gap-1 hover:underline cursor-pointer"
          >
            <LinkIcon className='p-1' />
            {url?.original_url}
            </a>

          <span className='flex items-end font-extralight text-sm'>
            {new Date(url?.created_at).toLocaleString()}
            </span>

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
          onClick={() => 
            fnDelete().then(() => {
              navigate("/dashboard");
            })
          }
        >
          {loadingDelete ? (<BeatLoader size={5} color='white' />) : <Trash />}
        </Button>
      </div>

          <div
            id={`qr-${url?.id}`}
            className="w-[400px] h-[400px] self-center sm:self-start p-1 ring ring-blue-500 rounded-md bg-white flex items-center justify-center"
          >
            <QRCode
              value={url?.original_url}
              size={380}
              ecLevel="H"
              quietZone={0}
              logoWidth={20}
            />
          </div>
        </div>

        <Card className="sm:w-3/5">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold">Stats</CardTitle>
          </CardHeader>
          {stats && stats.length ? (
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{stats?.length}</p>
                </CardContent>
              </Card>

              <CardTitle>Location Data</CardTitle>
              <Location stats={stats} />
              <CardTitle>Device Info</CardTitle>
              <DeviceStats stats={stats} />
            </CardContent>
          ) : (
            <CardContent>
              {loadingStats === false
                ? "No Statistics yet"
                : "Loading Statistics.."}
            </CardContent>
          )}
        </Card>

      </div>
  </>;
}

export default Link
