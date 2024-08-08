import "./ImageUpload.css";
import Button from "./Button/Button";
import { useRef,useState, useEffect } from "react";

const ImageUpload = props => {
  const [file, setFile] = useState()
  const [previewURL, setPreviewURL] = useState()
  const [isValid, setIsValid] = useState(false)
  const filePickerRef = useRef();

  useEffect(()=>{
    if(!file){
      return
    }
    const fileReader =  new FileReader()
    fileReader.onload = () =>{
      setPreviewURL(fileReader.result)
    }
    fileReader.readAsDataURL(file)
  },[file])

  const pickedHandler= (e) =>{
    let pickedFile;
    let fileIsValid = isValid
    if(e.target.files && e.target.files.length === 1){
      pickedFile = e.target.files[0]
      setFile(pickedFile)
      setIsValid(true)
      fileIsValid = true
      props.onInput(props.id, pickedFile, fileIsValid)
      return
    }else{
      setIsValid(false)
      fileIsValid = false
    }  
  }
  const pickImageHandler = () => {
    filePickerRef.current.click()
  };
  return (
    <div className="form-control">
      <input
        id={props.id}
        style={{ display: "none" }}
        type="file"
        accept=".jpg, .png, .jpeg"
        ref={filePickerRef}
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
         {
          previewURL ?
            <img src={previewURL} alt="preview" />
            : <p>Please pick an Image</p>
         }         
        </div>
        <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
      </div>
      {
        !isValid && <p>{props.errorText}</p>
      }
    </div>
  )
};

export default ImageUpload;
