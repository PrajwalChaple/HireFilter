export const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary configuration is missing in environment variables.');
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    // Optional: add a timestamp/random string to prevent caching issues or overwriting name
    // Cloudinary often handles uniqueness anyway.

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to upload file to Cloudinary');
        }

        const data = await response.json();
        // Return the secure URL provided by Cloudinary
        return data.secure_url;
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        throw new Error('An error occurred during file upload. Please try again.');
    }
};
