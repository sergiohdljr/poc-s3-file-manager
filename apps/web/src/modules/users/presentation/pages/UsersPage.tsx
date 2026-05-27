import axios from "axios";
import { useState } from "react";

export function UsersPage() {

  const [file, setFile] = useState<File | null>()

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  }

  const submit = async () => {
    if (!file) {
      return
    }

    const { size, type, name } = file


    const { data: uploadId } = await axios.post("http://localhost:3000/api/v1/files/upload",
      {
        filename: name,
        mimeType: type,
        size: size,
        folderId: null,
        ownerId: "a865afb2-9769-4c29-be08-75eb2ccda5ab"
      }
    )

    console.log(uploadId)
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
