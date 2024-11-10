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
const DeletedPlace = require('./models/DeletedPlace');
const DeletedRequest = require('./models/DeletedRequest');
const { BookedPlace, BookedRequest } = require('./models/Booked'); 
const Subscription = require('./models/Subscription');
const cron = require('node-cron');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

require('dotenv').config();

const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

const corsOptions = {
  origin: ['https://hikenrides.com', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  exposedHeaders: ['set-cookie'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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

    jwt.verify(token, jwtSecret, (err, userData) => {
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
      // Incorrect password
      res.status(422).json({ error: 'Invalid password' });
    }
  } else {
    // User not found with the given email
    res.status(404).json({ error: 'Invalid Email or Password' });
  }
});



app.use(passport.initialize());

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ error: 'Token not provided' });
  }

  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Extract user details from the token
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    // Find or create user in your database
    let user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ error: 'Invalid Email' });
    }

    // Create a JWT token based on user data
    const jwtToken = jwt.sign({ id: user._id, email: user.email }, jwtSecret);

    // Send the JWT token in the response
    res.json({ token: jwtToken });
  } catch (error) {
    console.error('Google login failed:', error);
    res.status(401).json({ error: 'Google login failed' });
  }
});


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === 'production'
  ? "https://hikenrides.com/auth/google/callback"
  : "http://localhost:5173/auth/google/callback"

},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName
      });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}
));

app.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    const subscription = new Subscription({ email });
    await subscription.save();
    res.status(201).json({ success: true, message: 'Subscription successful' });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'Email already subscribed' });
    } else {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
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
    extraInfo, owner_number, date, maxGuests,frequency ,status,
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
      extraInfo, owner_number, date, maxGuests,frequency ,status,
    });
    res.json(placeDoc);
  });
});

app.post('/requests', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {
    province, from, province2, destination, price,
    extraInfo, owner_number, date, NumOfPassengers, status
  } = req.body;
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, jwtSecret);
    const user = await User.findById(decodedToken.id);

    const totalCost = price * NumOfPassengers;

    if (user.balance < totalCost) {
      return res.status(400).json({
        success: false,
        message: "Insufficient funds. Please deposit money to your account to request trips."
      });
    }

    user.balance -= totalCost;
    await user.save();

    const RequestDoc = await Request.create({
      owner: user._id, price,
      province, from, province2, destination,
      extraInfo, owner_number, date, NumOfPassengers, status
    });

    res.json({
      success: true,
      message: "Your trip request has been successfully created and the cost of the trip has been deducted from your account. NB: Cash is refundable if you cancel the request or if a driver is not found by the time when the trip is supposed to take place.",
      request: RequestDoc
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the request."
    });
  }
});


app.post('/withdrawals', async (req, res) => {
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
      const user = await User.findById(userData.id);
      
      if (user.balance < amount) {
        return res.status(400).json({ error: 'Insufficient funds' });
      }

      user.balance -= amount;
      await user.save();

      const withdrawalsDoc = await Withdrawals.create({
        owner: userData.id,
        amount,
        accountNumber,
        accountName,
        bankName,
      });

      res.json({ success: true, message: 'Withdrawal is being processed. It will be sent within 24hrs of working days.', withdrawal: withdrawalsDoc });
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});


app.get('/user-places', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'JWT Token not provided' });
  }

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      console.error('JWT Verification Error:', err);
      return res.status(401).json({ error: 'JWT verification failed' });
    }

    try {
      const places = await Place.find({ 
        owner: userData.id, 
        status: { $in: ['active', 'hidden'] } 
      });
      res.json(places);
    } catch (error) {
      console.error('Error fetching places:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

app.delete('/places/:id', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  const placeId = req.params.id;

  if (!token) {
    return res.status(401).json({ error: 'JWT Token not provided' });
  }

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      console.error('JWT Verification Error:', err);
      return res.status(401).json({ error: 'JWT verification failed' });
    }

    try {
      const place = await Place.findById(placeId);
      if (!place) {
        return res.status(404).json({ error: 'Place not found' });
      }

      if (place.owner.toString() !== userData.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      await DeletedPlace.create({
        ...place.toObject(),
        status: 'deleted',
      });

      await Place.findByIdAndRemove(placeId);

      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting place:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});
app.put('/places/:id/status', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  const { status } = req.body;
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];

  if (!status || !['active', 'hidden'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      console.error('JWT Verification Error:', err);
      return res.status(401).json({ error: 'JWT verification failed' });
    }

    try {
      const place = await Place.findById(id);
      if (!place) {
        return res.status(404).json({ error: 'Place not found' });
      }
      if (place.owner.toString() !== userData.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      place.status = status;
      await place.save();
      res.json({ status: place.status });
    } catch (error) {
      console.error('Error updating place status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

app.delete('/requests/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const requestId = req.params.id;

    if (!token) {
      return res.status(401).json({ error: 'JWT Token not provided' });
    }

    const decoded = jwt.verify(token, jwtSecret);

    const request = await Request.findOne({ _id: requestId, owner: decoded.id });
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    await DeletedRequest.create({
      ...request.toObject(),
      status: 'deleted',
    });

    await Request.deleteOne({ _id: requestId });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Move expired places to DeletedPlace model
cron.schedule('0 0 * * *', async () => {
  mongoose.connect(process.env.MONGO_URL);
  const now = new Date();

  try {
    const expiredPlaces = await Place.find({ date: { $lt: now }, status: 'active' });
    for (const place of expiredPlaces) {
      await DeletedPlace.create({
        ...place.toObject(),
        status: 'expired',
      });
      await place.remove();
    }

    const expiredRequests = await Request.find({ date: { $lt: now }, status: 'active' });
    for (const request of expiredRequests) {
      await DeletedRequest.create({
        ...request.toObject(),
        status: 'expired',
      });
      await request.remove();
    }
  } catch (error) {
    console.error('Error moving expired documents:', error);
  }
});

app.put('/bookings2/cancel/:id', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;

  try {
    const booking = await BookedRequest.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = req.body.status;
    await booking.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Move booked places to DeletedPlace model
app.post('/book-place/:id', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  const placeId = req.params.id;

  if (!token) {
    return res.status(401).json({ error: 'JWT Token not provided' });
  }

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      console.error('JWT Verification Error:', err);
      return res.status(401).json({ error: 'JWT verification failed' });
    }

    try {
      const place = await Place.findById(placeId);
      if (!place) {
        return res.status(404).json({ error: 'Place not found' });
      }

      await DeletedPlace.create({
        ...place.toObject(),
        status: 'booked',
      });

      await place.remove();

      res.json({ success: true });
    } catch (error) {
      console.error('Error booking place:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

// Move booked requests to DeletedRequest model
app.post('/book-request/:id', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  const requestId = req.params.id;

  if (!token) {
    return res.status(401).json({ error: 'JWT Token not provided' });
  }

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      console.error('JWT Verification Error:', err);
      return res.status(401).json({ error: 'JWT verification failed' });
    }

    try {
      const request = await Request.findById(requestId);
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }

      await DeletedRequest.create({
        ...request.toObject(),
        status: 'booked',
      });

      await request.remove();

      res.json({ success: true });
    } catch (error) {
      console.error('Error booking request:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});
app.put('/bookings2/cancel/:id', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;

  try {
    const booking = await BookedRequest.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = req.body.status;
    await booking.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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

app.get('/requested-trips', (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = userData;
    try {
      const requests = await Request.find({ owner: id, status: { $in: ['active', 'hidden'] } });
      res.json(requests);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
});


app.put('/requests/:id/status', (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  const { status } = req.body;
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });

    const { id: userId } = userData;
    const request = await Request.findOne({ _id: id, owner: userId });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;
    await request.save();
    res.json(request);
  });
});

app.get('/places/:id', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  res.json(await Place.findById(id));
});


app.put('/places', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {
    id, province, from, province2, destination, color, brand, type, seats, price,
    extraInfo, owner_number, date, maxGuests,frequency ,status,
  } = req.body;
  const userData = await getUserDataFromReq(req);
  const placeDoc = await Place.findById(id);

  if (userData.id === placeDoc.owner.toString()) {
    placeDoc.set({
      province, from, province2, destination, color, brand, type, seats, price,
      extraInfo, owner_number, date, maxGuests,frequency ,status,
    });
    await placeDoc.save();
    res.json('ok');
  }
});
app.get('/places', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json(await Place.find());
});

app.get('/requests/:id', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  res.json(await Request.findById(id));
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

app.get('/requests', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json(await Request.find());
});

app.post('/bookings', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const {
    place, passengers, name, phone, price, reference,
  } = req.body;

  try {
    const placeData = await Place.findById(place);
    if (!placeData) {
      return res.status(404).json({ error: 'Place not found' });
    }

    if (placeData.maxGuests < passengers) {
      return res.status(400).json({ error: `The driver only wants ${placeData.maxGuests} guests` });
    }

    const ownerNumber = placeData.owner_number;

    const bookingDoc = await Booking.create({
      place, passengers, name, phone, price, reference, owner_number: ownerNumber, user: userData.id,
    });

    // Move the place to BookedPlace with status booked
    await BookedPlace.create({
      place: placeData._id,
      passengers,
      name,
      phone,
      price,
      reference,
      owner_number: ownerNumber,
      user: userData.id,
      status: 'booked',
    });

    // Update the maxGuests field
    placeData.maxGuests -= passengers;
    await placeData.save();

    res.json(bookingDoc);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/bookings2', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const {
    request, passengers, name, phone, price, reference,
  } = req.body;

  try {
    const requestData = await Request.findById(request);
    if (!requestData) {
      return res.status(404).json({ error: 'Request not found' });
    }
    const ownerNumber = requestData.owner_number;

    const bookingDoc = await Booking2.create({
      request, passengers, name, phone, price, reference, owner_number: ownerNumber, user: userData.id,
    });

    // Move the request to BookedRequest with status booked
    await BookedRequest.create({
      request: requestData._id,
      passengers,
      name,
      phone,
      price,
      reference,
      owner_number: ownerNumber,
      user: userData.id,
      status: 'booked',
    });

    res.json(bookingDoc);
  } catch (error) {
    console.error('Error creating booking2:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/bookings', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate('place'));
});

app.get('/bookings2', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { request } = req.query;

  try {
    const bookings = await BookedRequest.find({ request, status: 'booked' });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/upload-verification', upload.fields([{ name: 'idPhoto' }, { name: 'documentPhoto' }]), async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { idPhoto, documentPhoto } = req.files;
  const { phoneNumber } = req.body; // Get phone number from request body

  const uploadToS3 = async (file, newFileName) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: newFileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    const data = await s3Client.send(new PutObjectCommand(params));
    return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
  };

  try {
    // Generate new file names
    const idPhotoFileName = `${phoneNumber}_photo.jpg`;
    const documentPhotoFileName = `${phoneNumber}_identity.pdf`;

    // Upload files to S3
    const [idPhotoUrl, documentPhotoUrl] = await Promise.all([
      uploadToS3(idPhoto[0], idPhotoFileName),
      uploadToS3(documentPhoto[0], documentPhotoFileName)
    ]);

    // Update user's document in MongoDB with the URLs
    const user = await User.findOneAndUpdate(
      { phone_number: phoneNumber },
      { idPhotoUrl, documentPhotoUrl },
      { new: true }
    );

    res.status(200).json({
      message: 'Files uploaded successfully',
      idPhotoUrl,
      documentPhotoUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});


app.listen(port, () => {
  console.log(`Server running on PORT ${port}`);
});