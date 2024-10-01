import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {
    const {formatNaira,getCartAmount} = useContext(ShopContext);
  return (
    <div className='w-full'>
        <div className="text-2xl">
            <Title text1={'CART'} text2={'TOTAL'} />

        </div>
        <div className="flex flex-col gap-2 mt-2 text-sm">
            <div className="flex justify-between">
                <p>Subtotal</p>
                <p>{formatNaira(getCartAmount())}</p>
            </div>
            <hr />
            <div className="flex justify-between">
            </div>
            <hr />
            <div className="flex justify-between">
                <b>Total</b>
                <b>{formatNaira(getCartAmount()) === 0 ? 0 : formatNaira (getCartAmount() )}.00</b>
            </div>

        </div>
      
    </div>
  )
}

export default CartTotal
