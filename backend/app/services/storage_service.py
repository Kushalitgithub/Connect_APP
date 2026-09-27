"""
Storage service for handling file uploads to private object storage (S3-compatible).
"""
import os
import uuid
from typing import Optional
import boto3
from botocore.exceptions import ClientError

from app.core.config import settings


class StorageService:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            endpoint_url=settings.S3_ENDPOINT_URL,
            aws_access_key_id=settings.S3_ACCESS_KEY,
            aws_secret_access_key=settings.S3_SECRET_KEY,
            region_name=settings.S3_REGION
        )
        self.bucket_name = settings.S3_BUCKET_NAME
        self.private_prefix = "private/verification-docs/"

    async def upload_verification_document(
        self,
        file_content: bytes,
        filename: str,
        user_id: int
    ) -> str:
        """
        Upload a verification document to private storage.

        Args:
            file_content: The file content as bytes
            filename: Original filename
            user_id: ID of the user uploading the document

        Returns:
            str: The URL/path of the uploaded file in storage
        """
        # Generate a unique filename to prevent collisions
        file_extension = os.path.splitext(filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"

        # Construct the storage path
        storage_path = f"{self.private_prefix}user_{user_id}/{unique_filename}"

        try:
            # Upload file to S3/private storage
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=storage_path,
                Body=file_content,
                ContentType='application/octet-stream'  # Generic binary content type
            )

            # Return the storage path (in a real app, this might be a signed URL or CDN path)
            return storage_path

        except ClientError as e:
            raise Exception(f"Failed to upload file to storage: {str(e)}")

    async def get_verification_document_url(self, storage_path: str, expires_in: int = 3600) -> str:
        """
        Get a signed URL for accessing a verification document.

        Args:
            storage_path: The path to the file in storage
            expires_in: URL expiration time in seconds (default 1 hour)

        Returns:
            str: A signed URL for temporary access to the file
        """
        try:
            response = self.s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': storage_path
                },
                ExpiresIn=expires_in
            )
            return response
        except ClientError as e:
            raise Exception(f"Failed to generate presigned URL: {str(e)}")

    async def delete_verification_document(self, storage_path: str) -> bool:
        """
        Delete a verification document from storage.

        Args:
            storage_path: The path to the file in storage

        Returns:
            bool: True if deletion was successful
        """
        try:
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=storage_path
            )
            return True
        except ClientError as e:
            raise Exception(f"Failed to delete file from storage: {str(e)}")