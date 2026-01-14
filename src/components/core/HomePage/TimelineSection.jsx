import React from 'react'
import Logo1 from '../../../assets/TimeLineLogo/Logo1.svg';
import Logo2 from '../../../assets/TimeLineLogo/Logo2.svg';
import Logo3 from '../../../assets/TimeLineLogo/Logo3.svg';
import Logo4 from '../../../assets/TimeLineLogo/Logo4.svg';
import timelineImage from '../../../assets/Images/TimelineImage.png'

const timeline = [
    {
        Logo : Logo1,
        heading: "Leadership",
        description: "Fully committed to the success company"
    },
    {
        Logo : Logo2,
        heading: "Leadership",
        description: "Fully committed to the success company"
    },
    {
        Logo : Logo3,
        heading: "Leadership",
        description: "Fully committed to the success company"
    },
    {
        Logo : Logo4,
        heading: "Leadership",
        description: "Fully committed to the success company"
    },
]

function TimeLine() {
  return (
    <div>
      <div className='flex flex-row items-center gap-15' >
        <div className='w-[45%] flex flex-col gap-5'>
            {
                timeline.map((element, index)=>{
                    return (
                        <div className='flex flex-row gap-6' key={index}>
                            <div className='w-[50px] h-[50px] bg-white flex items-center'>
                               <img src = {element.Logo}/>
                            </div>
                            <div>
                                <h2 className='font-semibold text-[18px]'>{element.heading}</h2>
                                <p className='text-base'>{element.description}</p>
                            </div>
                        </div>
                    )
                })
            }
        </div>
        <div className='relative shadow-blue-200'>
            <img src={timelineImage}
                  alt='timelineImage'
                  className='object-cover shadow-white h-fit'/>
             <div className='absolute flex flex-row py-7 text-white uppercase bg-caribbeangreen-700 left-[50%] -translate-x-[50%] -translate-y-[50%]'>
                <div className='flex flex-row items-center gap-5 border-r border-caribbeangreen-300 px-7'>
                    <p className='text-3xl font-bold'>10</p>
                    <p className='text-sm text-caribbeangreen-300'>Years of Experience</p>
                </div>
                <div className='flex items-center gap-5 px-7'>
                    <p className='text-3xl font-bold'>250</p>
                    <p className='text-sm text-caribbeangreen-300'>Type of Courses</p>
                </div>
             </div>
        </div>

      </div>
      
    </div>
  )
}

export default TimeLine
