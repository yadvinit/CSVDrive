export class UploadResponseDto {
  success!: boolean;
  message!: string;
  s3Key?: string;
  recordsProcessed?: number;
}