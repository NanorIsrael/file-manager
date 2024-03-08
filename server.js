import express from 'express';
import fileUpload from 'express-fileupload';

import morgan, { format } from 'morgan';

import indexRouter from './routes';

const app = express();
app.use(express.json());
app.use(morgan('combined'));
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({ createParentPath: true }));

app.use('/', indexRouter);

const port = process.PORT || 6000;

app.listen(port, () => {
  console.log('server running.');
});
