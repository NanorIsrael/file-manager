import crypto from 'crypto';
import { ObjectID } from 'mongodb';

import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  static
  async postNew(req, res) {
    const { email } = req.body;
    const { password } = req.body;

    if (!email || !password) {
      res.statusCode = 400;
      return res.json({ error: `Missing ${email ? 'password' : 'email'}` });
    }

    try {
      const usersCollection = dbClient.db.collection('users');
      const user = await usersCollection.find({ email }).toArray();

      if (user.length) {
        res.statusCode = 400;
        return res.json({ error: 'Already exist' });
      }

      const hashedpassword = hashPassword(password);
      const savedUser = await usersCollection.insertOne({
        email,
        password: hashedpassword,
      });

      res.statusCode = 200;
      res.json({
        id: savedUser.insertedId,
        email,
        password: hashedpassword,
      });
    } catch (error) {
      res.statusCode = 500;
      res.json({ message: 'An error occured' });
    }
  }

  static
  async getMe(req, res) {
    const token = req.headers['x-token'];

    try {
      const userId = await redisClient.get(`auth_${token}`);
      if (!userId) {
        res.statusCode = 401;
        return res.json({ error: 'Unauthorized' });
      }
      const userCollections = dbClient.db.collection('users');
      const user = await userCollections.find({ _id: new ObjectID(userId) }).toArray();
      if (!user.length) {
        res.statusCode = 403;
        return res.json({ error: 'forbiden' });
      }

      res.statusCode = 200;
      res.json({
        id: user[0]._id,
        email: user[0].email,
      });
    } catch (error) {
      res.statusCode = 500;
      res.json({ message: 'An error occured' });
    }
  }
}
function hashPassword(password) {
  const sha1 = crypto.createHash('sha1');
  sha1.update(password);
  return sha1.digest('hex');
}
export default UsersController;
