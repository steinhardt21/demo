'use client'
import Image from 'next/image'
import axios from 'axios'
import FormData from "form-data";
import { useState } from 'react';

const config = {
  headers: {
    "x-api-key": "sec_9FrP2zFJXxYWuXQX1tmY5sLv6OysV7Iy",
    "Content-Type": "application/json",
  },
};

const data = {
  url: "https://www.glencore.com/.rest/api/v1/documents/static/a6349da6-3d11-4662-9107-28e19667d236/GLEN-2023-Half-Year-Report.pdf",
};


export default function Home() {
  const [pdf, setPdf] = useState(null);
  const [text, setText] = useState(""); // Added state for text input
  const [output, setOutput] = useState("")

  const handleClick = async () => {
    const response = await axios.post(
      "https://api.chatpdf.com/v1/sources/add-url",
      data,
      config
    );
    console.log(response);
    const { data: { sourceId } } = response;
    setPdf(sourceId);
  };

  const askPdf = async () => {
    const data = {
      sourceId: pdf,
      messages: [
        {
          role: "user",
          content: text
        },
      ],
    };

    console.log('text ', text)

    const response = await axios.post(
      "https://api.chatpdf.com/v1/chats/message",
      data,
      config
    );


    console.log("Result: ", response.data.content);
    setOutput(response.data.content)
  }


  const [file, setFile] = useState(null);

  const handleFileChange = (e: any) => {
    setFile(e.target.files?.[0]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    // uploadFile(file)

    const formData = new FormData();
    formData.append("file", file);

    const apiKey = "sec_9FrP2zFJXxYWuXQX1tmY5sLv6OysV7Iy";
    const headers = {
      "x-api-key": apiKey,
    };

    axios
      .post("https://api.chatpdf.com/v1/sources/add-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-api-key": "sec_9FrP2zFJXxYWuXQX1tmY5sLv6OysV7Iy",
        },
      })
      .then((response) => {
        // handle the response
        console.log(response);
        setPdf(response.data.sourceId)
      })
      .catch((error) => {
        // handle errors
        console.log(error);
      });
  };


  const uploadFile = async (file: any) => {
    const chunkSize = 1024 * 1024; // 1MB chunks (adjust as needed)
    const totalChunks = Math.ceil(file.size / chunkSize);
    const apiKey = "sec_9FrP2zFJXxYWuXQX1tmY5sLv6OysV7Iy";

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append("file", chunk);

      try {
        const response = await axios.post(
          "https://api.chatpdf.com/v1/sources/add-file",
          formData,
          {
            headers: {
              "x-api-key": apiKey,
              // Set the content type to multipart/form-data
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log(`Chunk ${chunkIndex + 1}/${totalChunks} uploaded.`);
      } catch (error: any) {
        console.error(`Error uploading chunk ${chunkIndex + 1}:`, error.message);
        return;
      }
    }

    console.log("File upload completed.");
  };


  const handleTextChange = (e: any) => {
    setText(e.target.value); // Update the 'text' state when the input changes
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form onSubmit={handleSubmit}>
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
      <p style={{ color: 'white' }}>{output}</p>
    </main>
  )
}
