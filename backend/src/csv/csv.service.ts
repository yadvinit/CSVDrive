import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3Service } from './s3.services';
import { CsvRecord } from './entities/csv-record.entity';
import { UploadResponseDto } from './dto/upload-response.dto';
import { Readable } from 'stream';
import csv from 'csv-parser';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CsvService {
  constructor(
    @InjectRepository(CsvRecord)
    private csvRecordRepository: Repository<CsvRecord>,
    private s3Service: S3Service,
  ) {}

  async uploadCsv(file: Express.Multer.File): Promise<UploadResponseDto> {
    // Validate file type
    if (!file.originalname.toLowerCase().endsWith('.csv')) {
      throw new BadRequestException('Only CSV files are allowed');
    }

    // Generate unique S3 key
    const s3Key = `${uuidv4()}-${file.originalname}`;

    try {
      // Upload to S3
      const fileStream = fs.createReadStream(file.path);
      await this.s3Service.uploadFile(s3Key, fileStream);

      // Parse CSV and save to database
      const recordsProcessed = await this.parseCsvAndSave(file, s3Key);

      // Clean up temporary file
      fs.unlinkSync(file.path);

      return {
        success: true,
        message: 'CSV file uploaded and processed successfully',
        s3Key,
        recordsProcessed,
      };
    } catch (error) {
      // Clean up temporary file if exists
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw error;
    }
  }

  private async parseCsvAndSave(file: Express.Multer.File, s3Key: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const results: { s3Key: string; fileName: string; data: any }[] = [];

      let recordCount = 0;

      fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', (data) => {
          try {
            // Skip empty rows
            if (Object.keys(data).length === 0) return;
            
            results.push({
              s3Key,
              fileName: file.originalname,
              data,
            });
            recordCount++;
          } catch (error) {
              if (error instanceof Error) {
                console.warn('Skipping invalid row:', error.message);
              } else {
                console.warn('Skipping invalid row:', error);
              }
            }
        })
        .on('end', async () => {
          try {
            if (results.length > 0) {
              await this.csvRecordRepository.save(results);
            }
            resolve(recordCount);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async getAllRecords(): Promise<Record<string, any>[]> {
    const records = await this.csvRecordRepository.find({
      order: { createdAt: 'DESC' },
    });
    return records.map(record => record.data);
  }

  // async getRecordsByS3Key(s3Key: string): Promise<CsvRecord[]> {
  //   return this.csvRecordRepository.find({
  //     where: { s3Key },
  //     order: { createdAt: 'DESC' },
  //   });
  // }

  async downloadOriginalFile(s3Key: string): Promise<Readable> {
    
    // Verify the file exists in our database
    const record = await this.csvRecordRepository.findOne({
      where: { s3Key },
    });

    if (!record) {
      throw new BadRequestException('File not found');
    }

    return this.s3Service.downloadFile(s3Key);
  }
}