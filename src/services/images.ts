import { upload } from 'cloudinary-react-native';
import { Cloudinary } from '@cloudinary/url-gen';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary-react-native/lib/typescript/src/api/upload/model/params/upload-params';

export const ImageService = {
  uploadImage: async (
    image: string,
  ): Promise<UploadApiResponse | undefined> => {
    try {
      const cld = new Cloudinary({
        cloud: {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          apiKey: process.env.CLOUDINARY_API_KEY,
          apiSecret: process.env.CLOUDINARY_API_SECRET,
        },
        url: {
          secure: true,
        },
      });

      let cloudinaryResponse;

      await upload(cld, {
        file: image,
        callback: (
          error?: UploadApiErrorResponse,
          response?: UploadApiResponse,
        ) => {
          cloudinaryResponse = response;
        },
      });

      return cloudinaryResponse;
    } catch (error) {
      console.log(error);
    }
  },
};
