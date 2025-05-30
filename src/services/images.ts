import axios from 'axios';

interface FileData {
  uri: string;
  type: string;
  name: string;
}

export const ImageService = {
  uploadImage: async (
    imageUri: string,
  ): Promise<{ secure_url: string } | undefined> => {
    try {
      console.log('Iniciando proceso de subida de imagen...');
      console.log('URI de la imagen:', imageUri);

      // Paso 1: Construir el FormData para la subida
      console.log('Construyendo FormData para la subida...');
      const formData = new FormData();
      const file: FileData = {
        uri: imageUri,
        type: 'image/jpeg', // Cambia el tipo si es necesario
        name: 'upload.jpg',
      };

      formData.append('file', file as unknown as Blob); // Cloudinary espera un Blob o File
      formData.append('upload_preset', 'unsigned_preset'); // Cambia esto por el nombre de tu preset unsigned
      formData.append('api_key', process.env.CLOUDINARY_API_KEY || '');
      formData.append('timestamp', Math.floor(Date.now() / 1000).toString());

      console.log('FormData construido:', formData);

      // Paso 2: Subir la imagen a Cloudinary
      console.log('Subiendo imagen a Cloudinary...');
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log('Respuesta de Cloudinary:', response.data);

      return response.data; // Devuelve el objeto completo con secure_url
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error al subir la imagen a Cloudinary:', error.message);
        if (error.response) {
          console.error('Detalles del error (response):', error.response.data);
        } else if (error.request) {
          console.error('Detalles del error (request):', error.request);
        }
      } else {
        console.error('Error desconocido:', error);
      }
      return undefined;
    }
  },
};
