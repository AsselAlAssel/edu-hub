'use client';
import PageContainer from '@/components/PageContainer';
import React, { useState } from 'react';

const UploadFile = () => {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                setMessage('File uploaded successfully');
            } else {
                setMessage(result.error || 'Failed to upload file');
            }
        } catch (error) {
            setMessage('Error: ' + (error as Error).message);
        }
    };

    return (
        <PageContainer>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {message && <p>{message}</p>}
        </PageContainer>
    );
};

export default UploadFile;
