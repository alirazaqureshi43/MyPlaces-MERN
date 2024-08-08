import { useCallback, useState, useRef, useEffect } from "react";

export const useHttpClient =() =>{
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()
    const activeHttpRequest = useRef([])

    const sendRequest =  useCallback(async (url, method='GET', body=null, headers={})=>{
        // console.log(body)
        setIsLoading(true)
        const httpAbortCtrl = new AbortController()
        activeHttpRequest.current.push(httpAbortCtrl)
       try {
        const res = await fetch(url,{
            method, 
            body,
            headers,
            signal: httpAbortCtrl.signal
        })
        const data = await res.json()
        activeHttpRequest.current = activeHttpRequest.current.filter(reqCtrl => reqCtrl !== httpAbortCtrl)
        console.log(data)
        if(!res.ok){ 
          throw new Error(data.message)
       }
       setIsLoading(false)
       return data;
       } catch (err) {
        setError(err.message)
        setIsLoading(false)
        throw err;
       }
        
    },[])

    const clearError = ()=>{
        setError(null)
     }

     useEffect(() => {
        return ()=>{
            activeHttpRequest.current.forEach(abortCtrl => abortCtrl.abort())
        }
     }, [])
     

    return{isLoading, error, sendRequest,clearError}
}