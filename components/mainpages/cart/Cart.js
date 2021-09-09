import React, {useContext, useState, useEffect} from 'react'
import {GlobalState} from '../../../GlobalState'
import axios from 'axios'
import PaypalButton from './PaypalButton'
// import addCart from './../../controller/userControl'

export default function Cart() {
    const state = useContext(GlobalState)
    const [cart,setCart]=state.userAPI.cart
    const [token] = state.token
    const[total,setTotal] =useState(0)
    //const[callback,setCallback] =state.userAPI.callback

useEffect (()=> {
        const getTotal =()=>
        {
            const total =cart.reduce((prev,item) =>
            {
                return prev + (item.price * item.quantity)
            },0)

            setTotal(total)
        }

        getTotal()

},[cart])

const addToCart = async (cart) =>
{
    await axios.patch('/user/addcart',{cart},
    {
        headers:{Authorization:token}
    })
    
}    

 //Product Increment   
    const increment =(id)=>{
        cart.forEach(item=>
            {
                if(item._id===id)
                {
                    item.quantity +=1;
                }
            })
            setCart([...cart])
            addToCart(cart)
    }

//Product Decrement
const decrement =(id)=>
{
    cart.forEach(item=>
        {
        if(item._id===id)
            {
                item.quantity === 1 ? item.quantity = 1 : item.quantity -=1
            }   
        })
        setCart([...cart])
        addToCart(cart)
}    

//Delete Product
const remove = id =>
{
    if(window.confirm('Do you want to delete this product'))
    {
        cart.forEach((item,index)=>
        {
            if(item._id === id)
            {
                cart.splice(index,1)
            }
        })
        setCart([...cart])
        addToCart(cart)
    }
}

const tranSuccess = async(payment)=>
{
    console.log(payment)
    const {paymentID,address} = payment;
    await axios.post('/api/payment',{cart,paymentID,address},
    {
        headers:{Authorization:token}
    })

    setCart([])
    addToCart([])
    alert("You have succesfully placed an order")
    //setCallback(!callback)
}

if(cart.length===0)
return <h2 style={{textAlign:"center",fontsize:"5rem"}}>Cart Empty</h2>
    return (
        <div>
            {
                cart.map((product) =>(
                 <div className="detail cart" key={product._id}>
                        <img src={product.images.url} alt=""/>
                    <div className="box-detail">
                        <h2>Title:{product.title}</h2>                    
                        <h3>7 Hours ₹ {product.price * product.quantity}</h3>
                        <p>Description : {product.description}</p>
                       <div className="amount">
                                <button onClick={()=> decrement(product._id)}> - </button>
                                <span>{product.quantity}</span>
                                <button onClick={()=> increment(product._id)}> + </button>
                            </div>
                                <div className="delete" onClick={()=> remove(product._id)}>
                                    X
                                </div>
                    </div>
                </div>
                ))
           }
            <div className="total">
                <h3>Total: ₹ {total}</h3>
                <PaypalButton
                total={total}
                tranSuccess={tranSuccess}/>
            </div>
        </div>
)
}
