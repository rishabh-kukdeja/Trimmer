import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


const Landingpage = () => {

  const [longUrl, setLongUrl] = useState();
  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();
    if(longUrl) {
      navigate(`/auth?createNew=${longUrl}`);
    }
  }

  return (
    <div className='flex flex-col items-center'>
      <h2 className='my-10 sn:my-16 text-3xl sm:text-6xl lg:text-7xl 
      text-white text-center font-extrabold'>
        The Only URL Shortner <br/> you'll ever need! 👇
      </h2>

      <form onSubmit={handleShorten} className='sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2'>
        <Input type="url" value={longUrl} placeholder='Enter your url'
        onChange={(e) => setLongUrl(e.target.value)}
        className="h-full flex-1 py-4 px-4"
        />
        <Button className='h-full' type="submit" variant="destructive">Shorten!</Button>
      </form>
      <img src="/banner.jpeg" alt="banner" className='w-full my-11 md:px-11'/>

      <Accordion type="multiple" collapsible className="w-full md:px-11">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            How does the Trimmer URL shortner works ?
          </AccordionTrigger>
          <AccordionContent>
            The Trimmer URL shortner works by taking in a long url and shortening it to a shorter url which can be easily shared with others.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            How does the Trimmer URL shortner works ?
          </AccordionTrigger>
          <AccordionContent>
            The Trimmer URL shortner works by taking in a long url and shortening it to a shorter url which can be easily shared with others.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            How does the Trimmer URL shortner works ?
          </AccordionTrigger>
          <AccordionContent>
            The Trimmer URL shortner works by taking in a long url and shortening it to a shorter url which can be easily shared with others.
          </AccordionContent>
        </AccordionItem>
      </Accordion>


    </div>
  )
}

export default Landingpage
