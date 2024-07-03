const port = process.env.PORT || 3000;
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3-node');
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
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

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

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.error('JWT not provided');
      return reject(new Error('JWT not provided'));
    }

    const token = authHeader.split(' ')[1];
    console.log('Received token:', token); // Log the received token
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
  mongoose.connect(process.env.MONGO_URL);
  res.json('test ok');
});

app.post('/register', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
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
      verification: 'not verified', // Set default verification status
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
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
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
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
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
  mongoose.connect(process.env.MONGO_URL);
  const { id, balance } = req.body;
  const userData = await getUserDataFromReq(req);
  if (userData.id !== id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const userDoc = await User.findByIdAndUpdate(id, { balance }, { new: true });
  res.json(userDoc);
});

app.post('/login', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });

  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          console.log('Generated token:', token); // Log the generated token
          res.json({ userDoc, token }); // Include token in response body
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
  mongoose.connect(process.env.MONGO_URL);
  try {
    const userData = await getUserDataFromReq(req);
    const { name, email, _id, balance, phone_number, verification, age, gender, isDriver } = await User.findById(userData.id);
    res.json({ name, email, _id, balance, phone_number, verification, age, gender, isDriver });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

app.post('/logout', (req, res) => {
  res.json(true);
});

app.post('/places', (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {
    province, from, province2, destination, color, brand, type, seats, price,
    extraInfo, owner_number, date, maxGuests,status,
  } = req.body;
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      console.error('JWT Verification Error:', err);
      return res.status(401).json({ error: 'JWT verification failed' });
    }
    const placeDoc = await Place.create({
      owner: userData.id, price,
      province, from, province2, destination, color, brand, type, seats,
      extraInfo, owner_number, date, maxGuests,status,
    });
    res.json(placeDoc);
  });
});

app.post('/requests', (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {
    province, from, province2, destination, price,
    extraInfo, owner_number, date, NumOfPassengers,status
  } = req.body;
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const RequestDoc = await Request.create({
      owner: userData.id, price,
      province, from, province2, destination,
      extraInfo, owner_number, date, NumOfPassengers,status
    });
    res.json(RequestDoc);
  });
});

app.post('/withdrawals', (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {
    amount, accountNumber, accountName, bankName,
  } = req.body;
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      console.error('JWT Verification Error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    try {
      const withdrawalsDoc = await Withdrawals.create({
        owner: userData.id,
        amount,
        accountNumber,
        accountName,
        bankName,
      });

      res.json(withdrawalsDoc);
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

app.get('/user-places', (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

app.get('/user-requests', (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const { id } = userData;
    res.json(await Request.find({ owner: id }));
  });
});

app.get('/places/:id', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  res.json(await Place.findById(id));
});

app.get('/requests/:id', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  res.json(await Request.findById(id));
});

app.put('/places', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {
    id, province, from, province2, destination, color, brand, type, seats, price,
    extraInfo, owner_number, date, maxGuests,status,
  } = req.body;
  const userData = await getUserDataFromReq(req);
  const placeDoc = await Place.findById(id);

  if (userData.id === placeDoc.owner.toString()) {
    placeDoc.set({
      province, from, province2, destination, color, brand, type, seats, price,
      extraInfo, owner_number, date, maxGuests,status,
    });
    await placeDoc.save();
    res.json('ok');
  }
});

app.put('/requests', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {
    id, province, from, province2, destination, price,
    extraInfo, owner_number, date, NumOfPassengers,status,
  } = req.body;
  const userData = await getUserDataFromReq(req);
  const requestDoc = await Request.findById(id);

  if (userData.id === requestDoc.owner.toString()) {
    requestDoc.set({
      province, from, province2, destination, price,
      extraInfo, owner_number, date, NumOfPassengers,status,
    });
    await requestDoc.save();
    res.json('ok');
  }
});

app.get('/places', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json(await Place.find());
});

app.get('/requests', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json(await Request.find());
});

app.post('/bookings', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const { place, place2, checkIn, checkOut, numberOfGuests, name, phone, email, gender } = req.body;

  if (!place && !place2) {
    return res.status(400).json({ error: 'At least one of place or place2 must be provided' });
  }

  let bookingDoc;

  try {
    if (place) {
      bookingDoc = await Booking.create({
        place, user: userData.id, checkIn, checkOut, numberOfGuests, name, phone, email, gender,
      });
    } else if (place2) {
      bookingDoc = await Booking2.create({
        place2, user: userData.id, checkIn, checkOut, numberOfGuests, name, phone, email, gender,
      });
    }

    res.json(bookingDoc);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/bookings', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);

  try {
    const bookings = await Booking.find({ user: userData.id }).populate('place');
    const bookings2 = await Booking2.find({ user: userData.id }).populate('place2');
    res.json({ bookings, bookings2 });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
