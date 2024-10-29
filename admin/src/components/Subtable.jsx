import React from 'react'

const Subtable = ({email,mongoId,deleteEmail,date}) => {
    const emailDate = new Date(date);

  return (
    <tr className='bg-white border-b text-left'>
        <th scope='row'className='px-6 py-4 fonr-medium text-gray-900 whitespace'>
        {email ? email : "No Email"}
        </th>
        <td className='px-6 py-4 hidden sm:block'>{emailDate.toDateString()}</td>
        <td className='px-6 py-4 cursor-pointer' onClick={()=>deleteEmail(mongoId)}>X</td>

    </tr>
  )
}

export default Subtable