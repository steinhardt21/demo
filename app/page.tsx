'use client'
import Image from 'next/image'
import axios from 'axios'
import FormData from "form-data";
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button, IconButton, Backdrop, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Textarea, FormControl, FormLabel, Input } from '@mui/joy';
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

  return (
    <Container fluid>
      <Row>
        {/* Left Side */}
        <Col md={3} style={{
          backgroundColor: 'rgb(0, 21, 41)',
          padding: '20px',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center', // Center items horizontally
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <form onSubmit={handleSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div>
                {/* <Button onClick={handleOpen}>Show backdrop</Button> */}
                <Backdrop
                  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                  open={open}
                // onClick={handleClose}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
              </div>
              <div>
                <label htmlFor="images" style={{
                  position: 'relative',
                  display: 'flex',
                  gap: '10px',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '200px',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '2px dashed #555',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'background .2s ease-in-out, border .2s ease-in-out',
                }}
                  className="drop-container" id="dropcontainer">
                  <span className="drop-title" style={{
                    color: '#fff',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    transition: 'color .2s ease-in-out',
                  }}>Drop files here</span> or
                  <input onChange={handleFileChange} type="file" id="images" />


                </label>
              </div>
              or
              <div style={{ marginTop: '10px' }}> <Input placeholder="Type url in here…" onChange={handlinkChange} /></div>
              <div style={{ marginTop: '10px' }}> <Input value={prom} placeholder="prompt" onChange={handlePrompt} /></div>
              <div style={{ marginTop: '20px', marginLeft: '90px' }}>
                <Button
                  type="submit"
                  variant="contained"
                  style={{ backgroundColor: 'white', color: 'black' }}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload
                </Button>
              </div>

            </form>
            <div style={{ marginTop: '20px', marginLeft: '80px' }}>
              <Button
                type="submit"
                onClick={askPdf}
                variant="contained"
                style={{ backgroundColor: 'gray', color: 'black' }}
              // startIcon={<CloudUploadIcon />}
              >
                Get insights
              </Button>
            </div>

          </div>

        </Col>

        {/* Right Side */}
        <Col md={9} style={{
          padding: '20px',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column', // Use column layout
        }}>
          <div className="right-side">
            {output}
          </div>
          {/* Add your input here */}
          <div style={{ marginTop: 'auto', marginBottom: '20px' }}>
            <Input
              sx={{ '--Input-decoratorChildHeight': '45px' }}
              placeholder="Insert question"
              type="text"
              required
              value={text}
              onChange={handleTextChange}
              endDecorator={
                <Button
                  // variant="solid"
                  color="primary"
                  // loading={data.status === 'loading'}
                  onClick={chatPdf}
                  sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                >
                  Ask
                </Button>
              }

            />
          </div>
        </Col>
      </Row >
    </Container >
  )
}

/* <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      <textarea
        placeholder="Enter text here"
        value={text}
        onChange={handleTextChange}
        style={{
          color: 'black',
          fontSize: '16px',
          width: '100%',
          minHeight: '100px', // Set the minimum height here
          resize: 'vertical', // Allow vertical resizing
        }}
        rows={4} // Specify the number of visible rows
      />
      <button onClick={askPdf}>Ask</button>
      <p style={{ color: 'white' }}>{output}</p> */