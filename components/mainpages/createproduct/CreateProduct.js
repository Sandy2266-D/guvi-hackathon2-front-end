import React, {useState, useContext, useEffect} from 'react'
import axios from 'axios'
import {GlobalState} from '../../../GlobalState'
import Loading from '../utils/loading/Loading'
import {useHistory, useParams} from 'react-router-dom'

const initialState={
    product_id:"",
    title:"",
    price:"",
    description:"All Products are Good and Nice at Cheap price",
    category:"",
     _id:""
}

export default function CreateProduct() {
const state=useContext(GlobalState)
const [product,setProduct] = useState(initialState)
const[categories]=state.categoriesAPI.categories
const[images,setImages] = useState(false)
const[loading,setLoading] = useState(false)

const[isAdmin] = state.userAPI.isAdmin
const [token] = state.token

const history =useHistory()
const params = useParams()

const [products] = state.productsAPI.products
const[onEdit,setOnEdit] = useState(false)
const[callback,setCallback] =state.productsAPI.callback

useEffect(()=>{
    if(params.id){
        setOnEdit(true)
        products.forEach(product=>{
            if(product._id === params.id)
            { 
                setProduct(product)
                setImages(product.images)
            }
        })
    }else{
        setOnEdit(false)
        setProduct(initialState)
        setImages(false)
    }
},[params.id,products])

const styleUpload={
    display : images ? "block" : "none"
}

const handleUpload = async e =>{
    e.preventDefault()
    try{
        if(!isAdmin) return alert("You are not an Admin")
        const file=e.target.files[0]
        //console.log(file)

        if(!file) return alert("File doesnot exist")

        if(file.size> 1024 * 1024) //1 MB
        return alert("Sizes too large")

        if(file.type !=='image/jpeg' && file.type !=='image/png') 
        return alert("File Format is Incorrect")

        let formData = new FormData()
        formData.append('file',file)

        setLoading(true)
        const res=await axios.post('/api/upload',formData,{
            headers:{'content-type':'multipart/form-data',Authorization:token}
        })

        setLoading(false)
        setImages(res.data)


    }catch(err)
    {
        alert(err.response.data.msg)
    }
}

const handleDestroy = async e=>
{
    try
    {
        if(!isAdmin) return alert("You are not an Admin")
        setLoading(true)
        await axios.post('/api/destroy',{public_id:images.public_id},
        {headers:{Authorization:token}
        })
        setLoading(false)
        setImages(false)
    }catch(err)
    {
        alert(err.response.data.msg)
    }

}

const handleInputChange = e=>
{
    const{name,value} = e.target
    setProduct({...product,[name]:value})
}

const handleSubmit = async e =>
{
    e.preventDefault()
    try{
        if(!isAdmin) return alert("You are not admin")
        if(!images) return alert("No Images Upload")

        if(onEdit){
            await axios.put(`/api/products/${product._id}`,{...product,images},{
                headers:{Authorization:token}
            })
        }else{
            await axios.post('/api/products',{...product,images},{
                headers:{Authorization:token}
                
            })
        }    
        setCallback(!callback)
        // setImages(false)
        // setProduct(initialState)
        history.push('/')
    }catch(err)
    {
        alert(err.response.data.Message)
    }
}
    return (
        <div className="create_product">
            <div className="upload">
                <input type="file" name="file" id="file_up" onChange={handleUpload}/>
                {
                    loading ?<div id="file_img"><Loading/></div>
                    :<div id="file_img" style={styleUpload}>
                    <img src={images ? images.url : ""} alt ="" />
                    <span onClick={handleDestroy}>X</span>
                </div>
                }
            </div>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <label htmlFor = "product_id">Product ID</label>
                    <input type="text" name="product_id" id="product_id" required
                    value={product.product_id} onChange={handleInputChange} disabled={onEdit}/>
                </div>

                <div className="row">
                    <label htmlFor = "title">Title</label>
                    <input type="text" name="title" id="title" required
                    value={product.title} onChange={handleInputChange} />
                </div>

                <div className="row">
                    <label htmlFor = "price">Price</label>
                    <input type="number" name="price" id="price" required
                    value={product.price} onChange={handleInputChange} />
                </div>

                <div className="row">
                    <label htmlFor = "description">Description</label>
                    <textarea type="text" name="description" id="description" required
                    value={product.description} rows="5" onChange={handleInputChange} /> 
                </div>

                {/* <div class="row">
                    <label htmlFor = "content">Content</label>
                    <textarea type="text" name="content" id="content" required
                    value={product.content} rows="7" onChange={handleInputChange} /> 
                </div> */}

                <div className="row">
                    <label htmlFor = "categories">Categories:</label>
                    <select name="category" value ={product.category} onChange={handleInputChange}>
                        <option value = "">Please select a Category</option>
                        {
                            categories.map(category =>(
                                <option value={category._id} key ={category._id}>
                                {category.name}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <button type="submit">{onEdit? "Update" : "Create"}</button>
            </form>            
        </div>
    )
}
