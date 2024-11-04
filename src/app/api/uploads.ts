// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from '../../../cloudinaryConfig'; // Importera din Cloudinary-konfiguration

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { image } = req.body;

    try {
      const result = await cloudinary.uploader.upload(image, {
        upload_preset: 'YOUR_UPLOAD_PRESET', // Om du har ett uppladdningspreset
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Error uploading image' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
