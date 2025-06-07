import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CsvService } from './csv.service';
import { UploadResponseDto } from './dto/upload-response.dto';
import { CsvRecord } from './entities/csv-record.entity';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Controller('api/csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.toLowerCase().endsWith('.csv')) {
          return cb(new BadRequestException('Only CSV files are allowed'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async uploadCsv(@UploadedFile() file: Express.Multer.File): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.csvService.uploadCsv(file);
  }

  @Get('records')
  async getAllRecords(): Promise<Record<string, any>[]> {
    return this.csvService.getAllRecords();
  }

  // @Get('records/:s3Key')
  // async getRecordsByS3Key(@Param('s3Key') s3Key: string): Promise<CsvRecord[]> {
  //   return this.csvService.getRecordsByS3Key(s3Key);
  // }

  @Get('download/:s3Key')
  async downloadFile(
    @Param('s3Key') s3Key: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const fileStream = await this.csvService.downloadOriginalFile(s3Key);
    
    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${s3Key}"`,
    });

    return new StreamableFile(fileStream);
  }
}