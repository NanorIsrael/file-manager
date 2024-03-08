import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'fs';
import { promisify } from 'util';
import dbClient from '../utils/db';

class FilesController {
  static
  async postUpload(req, res) {
    const user = req.currentUser;
    let file = {};
    const { name } = req.body;
    const { type } = req.body;
    const { data } = req.body;
    const { parentId } = req.body;
    const { isPublic } = req.body;

    if (!name || !type) {
      res.statusCode = 400;
      return res.json({ error: `Missing ${name ? 'type' : 'name'}` });
    }
    if (!data && type !== 'folder') {
      res.statusCode = 400;
      return res.json({ error: 'Missing data' });
    }

    try {
      const fileCollections = dbClient.db.collection('files');

      if (parentId) {
        file = await fileCollections.find({ parentId: parseInt(parentId, 10) }).toArray();
        if (!file.length) {
          res.statusCode = 400;
          return res.json({ error: 'Parent not found' });
        }
        if (file && file[1].type !== 'folder') {
          res.statusCode = 400;
          return res.json({ error: 'Parent is not a folder' });
        }
      }

      const savedFile = {
        userId: user._id,
        name,
        type,
        isPublic: isPublic || false,
        parentId: parentId || 0,
        ...file,
      };

      if (type === 'folder') {
        const result = await fileCollections.insertOne(savedFile);
        res.statusCode = 201;
        return res.json({
			id: result.insertedId,
			userId: user._id,
			name,
			type,
			isPublic: isPublic || false,
			parentId: 0,
		});
      }

      let folderPath = process.env.FOLDER_PATH;
      if (!folderPath) {
        folderPath = '/tmp/files_manager';
      }
      const localPath = uuidv4();
      const filePath = path.join(folderPath, localPath);

      if (data) {
        const fileData = Buffer.from(data, 'base64').toString();
        const fileWriter = promisify(writeFile);
        await fileWriter(filePath, fileData);
      }

      const result = await fileCollections.insertOne({ ...savedFile, localPath: filePath });

      res.statusCode = 201;
      res.json({
        id: result.insertedId,
        ...savedFile,
        localPath: filePath,
      });
    } catch (error) {
      res.statusCode = 500;
      res.json({ error: 'An error occured' });
    }
  }
}
export default FilesController;
