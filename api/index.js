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

async function getUserDataFromReq(req) {
  const token = req.cookies.token;
  if (!token) throw new Error('JWT not provided');

  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (err, userData) => {
      if (err) {
        console.error('JWT Verification Error:', err);
        return reject(new Error('JWT verification failed'));
      }
      resolve(userData);
    });
  });
}

function authenticate(req, res, next) {
  getUserDataFromReq(req)
    .then(userData => {
      req.userData = userData;
      next();
    })
    .catch(err => {
      res.status(401).json({ error: err.message });
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
  const userData = await getUserDataFromReq(req);

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

app.get('/messages/:receiverId', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
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

app.put('/users/update-balance', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id, balance } = req.body;
  const userData = await getUserDataFromReq(req);
  
  if (userData.id !== id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const userDoc = await User.findByIdAndUpdate(id, { balance }, { new: true });
    res.json(userDoc);
  } catch (error) {
    console.error('Error updating balance:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const jwt = require('jsonwebtoken');

// Login route example
app.post('/login', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict',
    });

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/profile', authenticate, async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

  try {
    const { name, email, _id, balance, phone_number, verification, age, gender } = await User.findById(req.userData.id);
    res.json({ name, email, _id, balance, phone_number, verification, age, gender });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').json(true);
});

app.post('/places', authenticate, async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {
    province, from, province2, destination, color, brand, type, seats, price,
    extraInfo, owner_number, date, maxGuests, status,
  } = req.body;

  try {
    const placeDoc = await Place.create({
      owner: req.userData.id, price,
      province, from, province2, destination, color, brand, type, seats,
      extraInfo, owner_number, date, maxGuests, status,
    });
    res.json(placeDoc);
  } catch (error) {
    console.error('Error creating place:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/requests', authenticate, async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {
    province, from, province2, destination, price,
    extraInfo, owner_number, date, NumOfPassengers, status
  } = req.body;

  try {
    const RequestDoc = await Request.create({
      owner: req.userData.id, price,
      province, from, province2, destination,
      extraInfo, owner_number, date, NumOfPassengers, status
    });
    res.json(RequestDoc);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/withdrawals', authenticate, async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {
    amount, accountNumber, accountName, bankName,
  } = req.body;

  try {
    const withdrawalDoc = await Withdrawals.create({
      owner: req.userData.id,
      amount,
      accountNumber,
      accountName,
      bankName,
      status: 'pending',
    });
    res.json(withdrawalDoc);
  } catch (error) {
    console.error('Error creating withdrawal:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/withdrawals/:owner', authenticate, async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { owner } = req.params;

  try {
    const withdrawals = await Withdrawals.find({ owner });
    res.json(withdrawals);
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/user/:id', authenticate, async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;

  try {
    const userDoc = await User.findById(id);
    res.json(userDoc);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/user-places', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);

  try {
    const places = await Place.find({ owner: userData.id });
    res.json(places);
  } catch (error) {
    console.error('Fetching User Places Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/user-requests', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);

  try {
    const requests = await Request.find({ owner: userData.id });
    res.json(requests);
  } catch (error) {
    console.error('Fetching User Requests Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/places', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

  try {
    const places = await Place.find();
    res.json(places);
  } catch (error) {
    console.error('Fetching Places Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/requests', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

  try {
    const requests = await Request.find();
    res.json(requests);
  } catch (error) {
    console.error('Fetching Requests Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/places/:id', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;

  try {
    const place = await Place.findById(id);
    res.json(place);
  } catch (error) {
    console.error('Fetching Place by ID Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/requests/:id', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;

  try {
    const request = await Request.findById(id);
    res.json(request);
  } catch (error) {
    console.error('Fetching Request by ID Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/places', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const {
    id, province, from, province2, destination, color, brand, type, seats, price,
    extraInfo, owner_number, date, maxGuests, status,
  } = req.body;

  try {
    const placeDoc = await Place.findById(id);

    if (userData.id !== placeDoc.owner.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    placeDoc.set({
      province, from, province2, destination, color, brand, type, seats, price,
      extraInfo, owner_number, date, maxGuests, status,
    });

    await placeDoc.save();
    res.json('ok');
  } catch (error) {
    console.error('Updating Place Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/requests', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const {
    id, province, from, province2, destination, price,
    extraInfo, owner_number, date, NumOfPassengers, status
  } = req.body;

  try {
    const RequestDoc = await Request.findById(id);

    if (userData.id !== RequestDoc.owner.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    RequestDoc.set({
      province, from, province2, destination, price,
      extraInfo, owner_number, date, NumOfPassengers, status
    });

    await RequestDoc.save();
    res.json('ok');
  } catch (error) {
    console.error('Updating Request Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/bookings', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);

  const {
    place, user, checkIn, checkOut, numberOfGuests, price, name, phone, brand, status
  } = req.body;

  try {
    const bookingDoc = await Booking.create({
      place, user, checkIn, checkOut, numberOfGuests, price, name, phone, brand, status
    });
    res.json(bookingDoc);
  } catch (error) {
    console.error('Creating Booking Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/bookings2', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);

  const {
    request, user, checkIn, checkOut, numberOfGuests, price, name, phone, status
  } = req.body;

  try {
    const bookingDoc = await Booking2.create({
      request, user, checkIn, checkOut, numberOfGuests, price, name, phone, status
    });
    res.json(bookingDoc);
  } catch (error) {
    console.error('Creating Booking2 Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/bookings', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);

  try {
    const bookings = await Booking.find({ user: userData.id }).populate('place');
    res.json(bookings);
  } catch (error) {
    console.error('Fetching Bookings Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/bookings2', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);

  try {
    const bookings2 = await Booking2.find({ user: userData.id }).populate('request');
    res.json(bookings2);
  } catch (error) {
    console.error('Fetching Bookings2 Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/uploads', upload.array('photos'), async (req, res) => {
  try {
    const uploadPromises = req.files.map(async (file) => {
      const ext = file.originalname.split('.').pop();
      const newFilename = `${Date.now()}.${ext}`;

      await s3Client.send(new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: newFilename,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      }));

      return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${newFilename}`;
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    res.json(uploadedFiles);
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});