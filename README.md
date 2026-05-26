# POC S3 File Manager

Proof of concept para gerenciamento de arquivos com armazenamento em S3.

## Requisitos

### Requisitos funcionais


| ID    | Requisito            | Descrição                                                                            |
| ----- | -------------------- | ------------------------------------------------------------------------------------ |
| RF-01 | Upload de arquivos   | O sistema deve permitir o envio de arquivos para o armazenamento.                    |
| RF-02 | Download de arquivos | O sistema deve permitir a recuperação e o download de arquivos previamente enviados. |


### Requisitos não funcionais


| ID     | Requisito          | Descrição                                                                                                                                                                                     |
| ------ | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RNF-01 | Uploads retomáveis | Os uploads devem ser retomáveis: em caso de interrupção (falha de rede, timeout, fechamento da sessão), o envio deve poder continuar de onde parou, sem reenviar o arquivo inteiro do início. |


RF-01

```mermaid
sequenceDiagram
  autonumber
  participant C as Client
  participant FS as File Service
  participant S3 as Amazon S3
  participant DB as Database

  C->>FS: POST /upload — file metadata
  FS->>S3: Request presigned URLs
  S3-->>FS: Return presigned URLs(per part)
  FS-->>C: Return presigned URLs
  FS->>DB: Save file record(status: pending)

  loop For each chunk
    C->>C: Split file into parts
    C->>S3: PUT part via presigned URL(multipart upload)
    S3-->>C: ETag per part
  end

  C->>FS: POST /upload/complete(ETags list)
  FS->>S3: Complete multipart upload
  S3-->>FS: Final object URL
  FS->>DB: Update status → uploaded save S3 URL
  FS-->>C: 200 OK — file URL
```