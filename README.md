
# CSV Drive: A Full-Stack CSV Management Application
This is a full-stack web application designed to handle the upload, store, process and visualize of CSV file data. The application uses a React frontend and a NestJS backend. Original files are stored in AWS S3 under unique key, while the parsed data is stored in a PostgreSQL database.


## Features of the Applications:

File Upload: Upload .csv file.
Cloud Storage: All uploaded CSV files are securely stored in a designated AWS S3 bucket for persistence.
Data Processing: The backend parses CSV data and saves each row as a structured JSON object in a PostgreSQL database.
Data Display: The frontend fetches and displays the processed data in table.
File Download: Download the original uploaded CSV file directly from the S3 bucket via a secure endpoint.


## Prerequisites: 
Before start, ensure you have the following installed:

1. Node.js and npm (or yarn)
2. Git
3. A running PostgreSQL instance (local)
4. AWS account with configured IAM credentials and an S3 bucket

## Database Connection
The application is configured to connect to a PostgreSQL database using settings from environment variables, with fallback default values for development.
The AWS credentials and S3 bucket configuration are managed through environment variables.

## Environment variables required to run the application.
### Database
1. DB_HOST: The hostname of your database server.
2. DB_PORT: The port number for the database server.
3. DB_USERNAME: The username for authenticating with the database.
4. DB_PASSWORD: The password for the database user.
5. DB_NAME: The specific name of the database to use.

### AWS S3
1. AWS_REGION: The AWS region where your S3 bucket resides.
2. AWS_ACCESS_KEY_ID: Your AWS account access key ID for programmatic access.
3. AWS_SECRET_ACCESS_KEY: Your AWS account secret access key.
4. S3_BUCKET_NAME: The name of the S3 bucket where files will be stored and retrieved.


## Upload a CSV File
1. This endpoint handles the upload of only CSV file for processing and storing which should be less then 5MB.
2. Endpoint: POST /api/csv/upload

## Get All Processed Records
1. This endpoint retrieves all records that have been parsed from the uploaded CSV files and shows us in table format in UI.
2. Endpoint: GET /api/csv/records

## Download the Original CSV File
1. This endpoint allows for downloading the original file that was uploaded to S3 using a unique key that will be genratred while uploading the file.
2. Endpoint: GET /api/csv/download/:s3Key

## Instructions for the frontend upload and display flow.

1. In frontend we have a option to select the file
2. After selecting the file clik on Upload File
3. We will get 2 options to one to SHOW DATA and other is Download File



