const port = process.env.PORT || 3000;
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3-node');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const User = require('./models/User');
const Place = require('./models/Place');
const Booking = require('./models/Booking');
const Booking2 = require('./models/Booking2');
const Request = require('./models/requests');
const Message = require('./models/message');
const Withdrawals = require('./models/withdrawals');

require('dotenv').config();

const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET || 'fasefraw4r5r3wq45wdfgw34twdfg';

mongoose.connect(process.env.MONGO_URL);

const corsOptions = {
  origin: ['https://hikenrides.com', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  exposedHeaders: ['set-cookie'],
};

const s3Client = new S3Client({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'None'
  }
}));

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    const token = req.session.token;

    if (!token) {
      return reject(new Error('JWT not provided'));
    }

    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) {
        console.error('JWT Verification Error:', err);
        return reject(new Error('JWT verification failed'));
      }
      resolve(userData);
    });
  });
}

app.get('/', (req, res) => {
  res.send('Hello, this is the root route of the backend!');
});

app.get('/api/database', (req, res) => {
  res.json('test ok');
});

app.post('/register', async (req, res) => {
  const { name, gender, phone_number, age, email, isDriver, driverLicense, password, messages, balance } = req.body;

  try {
    console.log('Received registration request:', { name, email });
    const userDoc = await User.create({
      name,
      gender,
      phone_number,
      age,
      email,
      isDriver,
      driverLicense,
      password: bcrypt.hashSync(password, bcryptSalt),
      messages,
      balance,
      verification: 'not verified',
      registrationDate: new Date(),
    });
    console.log('User registered:', userDoc);
    res.json(userDoc);
  } catch (e) {
    console.error('Registration failed:', e);
    res.status(422).json(e);
  }
});

app.post('/messages', async (req, res) => {
  const { token } = req.session;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;

    const { sender, receiver, content } = req.body;

    try {
      if (userData.id !== sender) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const messageDoc = await Message.create({
        sender,
        receiver,
        content,
      });

      res.json(messageDoc);
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

app.get('/messages/:receiverId', async (req, res) => {
  const { token } = req.session;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;

    const { receiverId } = req.params;

    try {
      if (userData.id !== receiverId) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const messages = await Message.find({ receiver: receiverId });

      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

app.put('/users/update-balance', async (req, res) => {
  const { id, balance } = req.body;
  const userData = await getUserDataFromReq(req);
  if (userData.id !== id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const userDoc = await User.findByIdAndUpdate(id, { balance }, { new: true });
  res.json(userDoc);
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });

  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);

    if (passOk) {
      jwt.sign(
        {
          email: userDoc.email,
          id: userDoc._id,
        },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;

          req.session.token = token;
          res.json(userDoc);
        }
      );
    } else {
      res.status(422).json('pass not ok');
    }
  } else {
    res.json('not found');
  }
});

app.get('/profile', async (req, res) => {
  const { token } = req.session;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id, balance, phone_number, verification, age, gender, isDriver } = await User.findById(userData.id);
      res.json({ name, email, _id, balance, phone_number, verification, age, gender, isDriver });
    });
  } else {
    res.json(null);
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid').json(true);
  });
});

app.post('/places', async (req, res) => {
  const { token } = req.session;
  const {
    province, from, province2, destination, color, brand, type, seats, price,
    extraInfo, owner_number, date, maxGuests, status,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id, price,
      province, from, province2, destination, color, brand, type, seats,
      extraInfo, owner_number, date, maxGuests, status,
    });
    res.json(placeDoc);
  });
});

app.post('/requests', async (req, res) => {
  const { token } = req.session;
  const {
    province, from, province2, destination, price,
    extraInfo, owner_number, date, NumOfPassengers, status
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const RequestDoc = await Request.create({
      owner: userData.id, price,
      province, from, province2, destination,
      extraInfo, owner_number, date, NumOfPassengers, status
    });
    res.json(RequestDoc);
  });
});

app.post('/withdrawals', async (req, res) => {
  const { token } = req.session;
  const {
    amount, accountNumber, accountName, bankName,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      console.error('JWT Verification Error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    try {
      const withdrawalDoc = await Withdrawals.create({
        owner: userData.id, amount,
        accountNumber, accountName, bankName,
        status: 'pending'
      });

      res.json(withdrawalDoc);
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

app.post('/upload', upload.array('photos', 100), async (req, res) => {
  const { token } = req.session;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const uploadedFiles = [];
    for (const file of req.files) {
      const { originalname, buffer, mimetype } = file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      const newFilename = Date.now() + '.' + ext;
      const uploadParams = {
        Bucket: 'ridesharebucket2',
        Key: newFilename,
        Body: buffer,
        ContentType: mimetype,
        ACL: 'public-read',
      };
      await s3Client.send(new PutObjectCommand(uploadParams));
      const fileUrl = `https://${uploadParams.Bucket}.s3.amazonaws.com/${uploadParams.Key}`;
      uploadedFiles.push(fileUrl);
    }
    res.json(uploadedFiles);
  });
});

app.get('/user-places', async (req, res) => {
  const { token } = req.session;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

app.get('/places/:id', async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

app.put('/places', async (req, res) => {
  const { token } = req.session;
  const {
    id, province, from, province2, destination, color, brand, type,
    seats, price, extraInfo, owner_number, date, maxGuests, status
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        province, from, province2, destination, color, brand, type,
        seats, price, extraInfo, owner_number, date, maxGuests, status
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
});

app.get('/places', async (req, res) => {
  res.json(await Place.find());
});

app.post('/bookings', async (req, res) => {
  const { token } = req.session;
  const userData = await getUserDataFromReq(req);
  const { place, checkIn, checkOut, numberOfGuests, name, phone, price } = req.body;
  Booking.create({
    place, user: userData.id,
    checkIn, checkOut, numberOfGuests, name, phone, price,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    res.status(500).json(err);
  });
});

app.get('/bookings', async (req, res) => {
  const { token } = req.session;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const { id } = userData;
    res.json(await Booking.find({ user: id }).populate('place'));
  });
});

app.post('/bookings2', async (req, res) => {
  const { token } = req.session;
  const userData = await getUserDataFromReq(req);
  const { place, checkIn, checkOut, numberOfGuests, name, phone, price } = req.body;
  Booking2.create({
    place, user: userData.id,
    checkIn, checkOut, numberOfGuests, name, phone, price,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    res.status(500).json(err);
  });
});

app.get('/bookings2', async (req, res) => {
  const { token } = req.session;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const { id } = userData;
    res.json(await Booking2.find({ user: id }).populate('place'));
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
