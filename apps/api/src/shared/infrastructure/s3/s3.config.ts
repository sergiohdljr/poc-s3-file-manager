export interface S3Config {
  region: string;
  bucket: string;
  endpoint?: string;
  forcePathStyle?: boolean;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

export function loadS3Config(): S3Config {
  const region = process.env.AWS_REGION;
  const bucket = process.env.S3_BUCKET;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!region) {
    throw new Error('AWS_REGION is required (ex.: sa-east-1)');
  }
  if (!bucket) {
    throw new Error('S3_BUCKET is required');
  }

  const config: S3Config = { region, bucket };

  if (accessKeyId && secretAccessKey) {
    config.credentials = { accessKeyId, secretAccessKey };
  } else if (accessKeyId || secretAccessKey) {
    throw new Error(
      'Set both AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY, or omit both to use the default AWS credential chain (CLI profile, IAM role, etc.)',
    );
  }

  const endpoint = process.env.S3_ENDPOINT?.trim();
  if (endpoint) {
    config.endpoint = endpoint;
    config.forcePathStyle = process.env.S3_FORCE_PATH_STYLE === 'true';
  }

  return config;
}
