import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets'; // Assuming assets might be used elsewhere
import RelatedDoctors from '../components/RelatedDoctors';

const Appointment = () => {
  const { docId } = useParams(); // Extract docId from URL
  const { doctors,currencySymbol } = useContext(AppContext); // Use context to get doctors list
  const daysOfWeek = ['SUN','MON','TUE','WED','THUR','FRI','SAT']

  const [docInfo, setDocInfo] = useState(null); // State to store doctor information
 const [docSlots,setDocSlots] = useState([]);
 const [slotIndex,setSlotIndex] = useState(0);
 const [slotTime,setSlotTime] = useState('');
  // Fetch doctor information
  const fetchDocInfo = () => {
    const docInfo = doctors?.find(doc => doc._id === docId); // Ensure doctors is not undefined
    setDocInfo(docInfo); // Set doctor info to state
    console.log('Doctor Info:', docInfo); // Log the doctor information
  };
const getAvailableSlots = async () =>{
  setDocSlots([])
  // getting current date
  let today = new Date()
  for(let i = 0;i<7;i++){
    // getting date with index
    let currentDate = new Date(today)
    currentDate.setDate(today.getDate()+i) 
    //setting end time of the date with index
    let endTime = new Date()
    endTime.setDate(today.getDate()+i)
    endTime.setHours(21,0,0,0)

    // setting hours
    if(today.getDate() === currentDate.getDate()){
      currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() +1 :10)
     currentDate.setMinutes(currentDate.getMinutes() >30 ? 30 :0)
    }
    else{
      currentDate.setHours(10)
      currentDate.setMinutes(0)
    }
    let timeSlots = []
    while(currentDate < endTime){
      let formattedTime = currentDate.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`}) 
   //add slots to array
   timeSlots.push({
    datetime: new Date(currentDate),
    time:formattedTime
   })
   //Increment current time by 30 minutes
   currentDate.setMinutes(currentDate.getMinutes()+30)
    }
   setDocSlots(prev => ([...prev,timeSlots])) 
  }
}
  // Effect that runs when doctors or docId changes
  useEffect(() => {
    if (doctors) {
      fetchDocInfo()
    }
  }, [doctors, docId])
  useEffect(()=>{
    getAvailableSlots()
  },[docInfo])

  useEffect(()=>{
    console.log(docSlots)
  },[docSlots])

  return docInfo && (
    <div>
      {/* Doctor details */}
      <div className='flex flex-col sm:flex-row gap-4 items-stretch'>
        {/* Left side - Doctor image */}
        <div className='w-full sm:w-1/3'>
          {/* Render the image only if the image URL is valid */}
          {docInfo.image ? (
            <img
              className='bg-primary w-full sm:max-w-full h-full rounded-lg object-cover'
              src={docInfo.image}
              alt={docInfo.name}
            />
          ) : (
            <p>No image available</p> // Fallback if image is missing
          )}
        </div>
        
        {/* Right side - Doctor information */}
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white'>
          <p className=' flex items-center gap-2  font-medium text-gray-900 font-bold text-2xl'>Dr. {docInfo.name} <img className='inline-block w-5' src={assets.verified_icon} alt="" /></p>
          <div className='flex items-center gap-2  mt-4 text-gray-600'>
            <p className='text-gray-600'>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='mt-2 px-6 py-2 bg-blue-500 text-white rounded'>{docInfo.experience}  Experience</button>
          </div>
          
          {/* Doctor's about section */}
          <div className='mt-6'>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img className='inline-block w-4' src={assets.info_icon} alt="" /></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>Appointment Fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span></p>
          {/* Other doctor details can be rendered here */}
        </div>
      </div>
      {/* ----booking slots--- */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
          <p>Booking Slots</p>
          <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
            {
              docSlots.length && docSlots.map((item,index)=>(
               <div onClick={()=> setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray' }`} key={index}>
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
               </div>

              ))
            }
          </div>
          {/* below booking slots showing */}
          <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
            {
              docSlots.length && docSlots[slotIndex].map((item,index)=>(
                <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime  ? 'bg-primary text-white':'text-gray-400 border border-gray-600'}`} key={index}>
                  {item.time.toLowerCase()}
                </p>
              ))
            }
          </div>
          
            <button className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an Appoinment</button>
          
      </div>

      {/* Listing Related Doctors */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
    </div>
  );
};

export default Appointment;
