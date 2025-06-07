import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CsvController } from './csv.controller';
import { CsvService } from './csv.service';
import { S3Service } from './s3.services';
import { CsvRecord } from './entities/csv-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CsvRecord])],
  controllers: [CsvController],
  providers: [CsvService, S3Service],
})
export class CsvModule {}