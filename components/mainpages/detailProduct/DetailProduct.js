import React, {useContext, useState, useEffect} from 'react'
import {useParams, Link} from 'react-router-dom'
import {GlobalState} from '../../../GlobalState'
import ProductItem from '../utils/productItem/ProductItem'


export default function DetailProduct() {
    const params=useParams()
    const state=useContext(GlobalState)
    const [products]=state.productsAPI.products
    const addCart = state.userAPI.addCart
    const [detailProduct,setDetailProduct] = useState([])
    useEffect(()=>
     {
         //console.log("re-render")
         if(params.id)
         {
             products.forEach(product=>
                 {
                     if(product._id===params.id) setDetailProduct(product)
                 })
         }
     },[params.id,products])
     //console.log(detailProduct)

     if(detailProduct.length === 0) return null;

    return (
        <>
        <div className="detail">
                <img src={detailProduct.images.url} alt=""/>
            <div className="box-detail">
                        <div className="row">
                            <h2>Title:{detailProduct.title}</h2>
                        </div>
                <span>Price: ₹ {detailProduct.price}</span>
                <p>Description : {detailProduct.description}</p>
                <p>Sold : {detailProduct.sold}</p>
                <Link to="/cart" className="cart" 
                onClick={() =>addCart(detailProduct)}>
                Buy Now</Link>
            </div>
        </div>

        <div>
            <h2>Related Products</h2>
            <div className="products">
                {
                    products.map(product =>
                        {
                            return product.category===detailProduct.category
                        ? <ProductItem key ={product._id} product={product}/> :null
                        })
                }
            </div>
        </div>
        </>

    )
}

