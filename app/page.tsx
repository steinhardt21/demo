'use client'
import Image from 'next/image'
import axios from 'axios'
import FormData from "form-data";
import { useState, useCallback, useMemo, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button, IconButton, Backdrop, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Textarea, FormControl, FormLabel, Input } from '@mui/joy';
import { useDropzone } from 'react-dropzone'
import './globals.css'

const config = {
  headers: {
    "x-api-key": "sec_9FrP2zFJXxYWuXQX1tmY5sLv6OysV7Iy",
    "Content-Type": "application/json",
  },
};



export default function Home() {
  const [pdf, setPdf] = useState(null);
  const [memory, setMemory] = useState<{ role: string; content: string; }[]>([]); // Define the initial state type
  const [text, setText] = useState("Identify the challenges and opportunities that the company faced this fiscal year and list them as bullet points."); // Added state for text input
  const [prom, setProm] = useState('Identify the challenges and opportunities that the company faced this fiscal year and list them as bullet points.')

  const [output, setOutput] = useState("")

  const [origin, setOrigin] = useState(null);
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState(null);
  const [open, setOpen] = useState(false);
  const [openPopUp, setOpenPopUp] = useState(false);

  const handleClickOpen = () => {
    setOpenPopUp(true);
  };

  const handleClose = async () => {
    setOpenPopUp(false);
    console.log('** URL 1')
    console.log('** URL ', url)
    setOpen(true);

    if (url) {

      console.log('** URL 2')
      const apiKey = "sec_9FrP2zFJXxYWuXQX1tmY5sLv6OysV7Iy";
      const headers = {
        "x-api-key": apiKey,
      };
      const data = {
        url: url
      };

      const response = await axios.post("https://api.chatpdf.com/v1/sources/add-url", data, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "sec_9FrP2zFJXxYWuXQX1tmY5sLv6OysV7Iy",
        },
      })

      if (pdf === null) setPdf(response.data.sourceId)
      // setOrigin(response.data.sourceId)
      console.log('**** set pdf ', pdf)
      setOpen(false);
    }
  };


  const chatPdf = async () => {
    const myData = memory
    myData.push({ role: "user", content: text })

    console.log('myData ', myData)
    const data = {
      sourceId: pdf,
      messages: myData,
    };
    // Add the user's input to memory
    setMemory((prevMemory) => [...prevMemory, { role: "user", content: text }]);

    console.log('text ', text)



    const response = await axios.post(
      "https://api.chatpdf.com/v1/chats/message",
      data,
      config
    );
    setMemory((prevMemory) => [...prevMemory, { role: "assistant", content: response.data.content }]);



    console.log("Result: ", response.data.content);
    setOutput(response.data.content)
  }

  const askPdf = async () => {

    setOpen(true);
    const data = {
      sourceId: pdf,
      messages: [
        {
          role: "user",
          content: prom
        },
      ],
    };
    // Add the user's input to memory
    setMemory((prevMemory) => [...prevMemory, { role: "user", content: text }]);

    console.log('text ', text)



    const response = await axios.post(
      "https://api.chatpdf.com/v1/chats/message",
      data,
      config
    );
    setMemory((prevMemory) => [...prevMemory, { role: "assistant", content: response.data.content }]);



    console.log("Result: ", response.data.content);
    setOutput(response.data.content)
    setOpen(false)
  }

  const handleFileChange = (e: any) => {
    setFile(e.target.files?.[0]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('****** MY file ')
    e.preventDefault()

    if (url) {
      setOpen(true);
      console.log('** URL')

      // uploadFile(file)

      const formData = new FormData();
      formData.append("file", file);

      const apiKey = "sec_9FrP2zFJXxYWuXQX1tmY5sLv6OysV7Iy";
      const headers = {
        "x-api-key": apiKey,
      };
      const data = {
        url: url
      };

      const response = await axios.post("https://api.chatpdf.com/v1/sources/add-url", data, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "sec_9FrP2zFJXxYWuXQX1tmY5sLv6OysV7Iy",
        },
      })

      if (pdf === null) setPdf(response.data.sourceId)
      // setOrigin(response.data.sourceId)
      console.log('**** set pdf ', pdf)
      setOpen(false);
    }
    else {
      if (!file) return
      console.log('**2')

      setOpen(true);

      // uploadFile(file)

      const formData = new FormData();
      formData.append("file", file);

      const apiKey = "sec_9FrP2zFJXxYWuXQX1tmY5sLv6OysV7Iy";
      const headers = {
        "x-api-key": apiKey,
      };

      const response = await axios.post("https://api.chatpdf.com/v1/sources/add-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-api-key": "sec_9FrP2zFJXxYWuXQX1tmY5sLv6OysV7Iy",
        },
      })

      setPdf(response.data.sourceId)
      setOrigin(response.data.sourceId)
      console.log('**** set pdf ', pdf)
      setOpen(false);
    }



  };

  const handleTextChange = (e: any) => {
    setText(e.target.value); // Update the 'text' state when the input changes
  };


  const handlinkChange = (e: any) => {
    setUrl(e.target.value); // Update the 'text' state when the input changes
  }

  const handlePrompt = (e: any) => {
    setProm(e.target.value); // Update the 'text' state when the input changes
  }

  const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  };

  const focusedStyle = {
    borderColor: '#2196f3'
  };

  const acceptStyle = {
    borderColor: '#00e676'
  };

  const rejectStyle = {
    borderColor: '#ff1744'
  };


  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles
  } = useDropzone();

  const styleDrop = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);

  const uploadFile = async () => {
    if (acceptedFiles.length > 0 && acceptedFiles[0].name) {
      setTextDropZone(acceptedFiles[0]?.name)

      console.log('**1')

      if (url) {
        setOpen(true);
        console.log('**2')

        // uploadFile(file)

        const formData = new FormData();
        formData.append("file", acceptedFiles[0]);

        const apiKey = "sec_9FrP2zFJXxYWuXQX1tmY5sLv6OysV7Iy";
        const headers = {
          "x-api-key": apiKey,
        };
        const data = {
          url: url
        };

        const response = await axios.post("https://api.chatpdf.com/v1/sources/add-url", data, {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "sec_9FrP2zFJXxYWuXQX1tmY5sLv6OysV7Iy",
          },
        })

        if (pdf === null) setPdf(response.data.sourceId)
        // setOrigin(response.data.sourceId)
        console.log('**** set pdf ', pdf)
        setOpen(false);
      }
      else {
        if (!acceptedFiles[0]) return
        console.log('**2')

        setOpen(true);

        // uploadFile(file)

        const formData = new FormData();
        formData.append("file", acceptedFiles[0]);

        const apiKey = "sec_9FrP2zFJXxYWuXQX1tmY5sLv6OysV7Iy";
        const headers = {
          "x-api-key": apiKey,
        };

        const response = await axios.post("https://api.chatpdf.com/v1/sources/add-file", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-api-key": "sec_9FrP2zFJXxYWuXQX1tmY5sLv6OysV7Iy",
          },
        })

        setPdf(response.data.sourceId)
        setOrigin(response.data.sourceId)
        console.log('**** set sourceId ', response.data.sourceId)
        console.log('**** set pdf ', pdf)
        setOpen(false);
      }
    }
  }

  useEffect(() => {

    uploadFile()
      // make sure to catch any error
      .catch(console.error);
  }, [acceptedFiles]);


  const [textDropZone, setTextDropZone] = useState('Drag and drop your file here, or click to select file')


  return (
    <Container fluid>
      < Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Row>
        {/* Left Side */}
        <Col md={6} style={{
          padding: '1%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          // width: '23%',
          alignItems: 'center', // Center items horizontally
        }}>
          <div style={{
            width: '100%',
            height: '10%',
          }}>
          </div>
          <div style={{
            width: '90%',
            height: '90%',
            borderRadius: '15px',
            boxShadow: 'rgb(0 0 0 / 24%) 1px 1px 2px 1px'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#f5f5f5',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} {...getRootProps({ styleDrop })}>
              <input {...getInputProps()} />
              <p>{textDropZone}</p>
            </div>
            <p
              onClick={handleClickOpen}
              style={{
                bottom: '0',
                left: '0',
                cursor: 'pointer',
              }}
            >From URL</p>
            <Dialog open={openPopUp} onClose={handleClose}>
              <DialogTitle>URL pdf</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Insert the URL of your PDF file here to get insights.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="URL"
                  type="url"
                  onChange={handlinkChange}
                  fullWidth
                  variant="standard"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Back</Button>
                <Button onClick={handleClose}>Send</Button>
              </DialogActions>
            </Dialog>
          </div>
        </Col>

        {/* Right Side */}
        <Col md={6} style={{
          padding: '20px',
          height: '100vh',
          alignItems: 'center'
        }}>

          <div style={{
            width: '100%',
            height: '10%'
          }}>

          </div>

          <div style={{
            // border: '1px solid black',
            width: '90%',
            height: '90%',
            marginBottom: '5%',
            flexDirection: 'column',
            display: 'flex',
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'row',
            }}>
              <div

                onClick={() => askPdf()}
                style={{
                  // border: '1px solid black',
                  width: '50%',
                  height: '90%',
                  marginRight: '2%',
                  borderRadius: '15px',
                  boxShadow: 'rgb(0 0 0 / 24%) 1px 1px 2px 1px',
                  cursor: 'pointer',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                <p><b>OPPORTUNITIES</b></p>
                <p>Single prompt</p>
              </div>

              <div
                onClick={() => askPdf()}

                style={{
                  width: '50%',
                  height: '90%',
                  marginLeft: '2%',
                  borderRadius: '15px',
                  boxShadow: 'rgb(0 0 0 / 24%) 1px 1px 2px 1px',
                  cursor: 'pointer',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                <p><b>RISKS</b></p>
                <p>Single prompt</p>
              </div>
            </div>

            <div style={{
              width: '100%',
              height: '100%',
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '15px',
                boxShadow: 'rgb(0 0 0 / 24%) 1px 1px 2px 1px',
                padding: '20px',
              }}>
                {output}
              </div>

            </div>
          </div>

        </Col>
      </Row >
    </Container >
  )
}
