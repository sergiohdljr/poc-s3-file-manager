import axios from "axios";
import { useState } from "react";

export function FilesPage() {

  const [filesList, setFilesList] = useState<[]>()
  const [file, setFile] = useState<File | null>()
  const CHUNK_SIZE = 5 * 1024 * 1024
  const userId = "a865afb2-9769-4c29-be08-75eb2ccda5ab"

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  }

  const submit = async () => {
    if (!file) {
      return
    }

    const { size, type, name } = file

    const { data } = await axios.post("http://localhost:3000/api/v1/files/upload",
      {
        filename: name,
        mimeType: type,
        size: size,
        folderId: null,
        ownerId: "a865afb2-9769-4c29-be08-75eb2ccda5ab"
      }
    )

    const { signedUrls, uploadId, key } = data


    const parts = await Promise.all(
      signedUrls.map(async (url, i) => {

        const start = i * CHUNK_SIZE
        const end = Math.min(start + CHUNK_SIZE, file.size)
        const chunk = file.slice(start, end)

        const response = await axios.put(url, chunk)

        const ETag = response?.headers?.get("ETag")
        return { PartNumber: i + 1, ETag }
      })
    )

    return await axios.post("http://localhost:3000/api/v1/files/upload/complete", {
      key,
      uploadId,
      parts
    })

  }

  const listFiles = async () => {

    const { data } = await axios.get(`http://localhost:3000/api/v1/files/list/${userId}`)

    setFilesList(data)
    console.log(filesList)
  }

  const download = async (fileId: string, fileName: string) => {
    const { data } = await axios.get(`http://localhost:3000/api/v1/files/download/${userId}/${fileId}`)
    const a = document.createElement("a");
    a.href = data.downloadUrl;
    a.target = "_blank";
    a.rel = "noreferrer";
    if (fileName) a.download = fileName;
    a.click();
    return
  }

  return (
    <main>

      <input onChange={onChangeFile} type="file" />
      <br></br>
      <br></br>
      <button onClick={submit} >upload</button>
      <button onClick={listFiles} >buscar arquivos</button>

      <>
        <ul>
          {filesList && filesList?.map((file, i) => {
            return (
              <div style={{ display: 'flex' }} >
                <li>{file._filename} - {file._size} - {file._type}  </li>
                <button onClick={() => download(file.id, file._name)} >download</button>
              </div>
            )
          })}
        </ul>

      </>

    </main>
  );
}
