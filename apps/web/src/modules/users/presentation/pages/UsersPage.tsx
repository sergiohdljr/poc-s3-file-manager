import axios from "axios";
import { useState } from "react";

export function UsersPage() {

  const [file, setFile] = useState<File | null>()
  const CHUNKSIZE = 5 * 1024 * 1024

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
        const chunk = file.slice(i * CHUNKSIZE, (i + 1) + CHUNKSIZE)

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

  return (
    <main>

      <input onChange={onChangeFile} type="file" />
      <br></br>
      <br></br>
      <button onClick={submit} >fazer</button>

    </main>
  );
}
