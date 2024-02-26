const port = 4000;
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const Booking2 = require('./models/Booking2.js')
const Request = require('./models/requests.js');
const Message = require('./models/message.js');
const Withdrawals = require('./models/withdrawals.js');
const twilio = require('twilio');

const cookieParser = require('cookie-parser');

require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';
const bucket = 'hikenrides-booking-app';
const accountSid = 'ACd5bb965fa354cca20f5398d7b3b301da';
const authToken = process.env.AUTH_TOKEN;
const twilioPhoneNumber = '+13856267146';

const client = twilio(accountSid, authToken);

const corsOptions = {
  origin: ['https://hikenrides.com', 'http://localhost:5173'],
  credentials: true,
  exposedHeaders: ['set-cookie'],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());


function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies.token;

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



app.get('/api/database', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json('test ok');
});

app.post('/register', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {name,gender,phone_number,age,email,isDriver,driverLicense,password,messages,balance} = req.body;

  try {
    console.log('Received registration request:', {name, email});
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

// Add this endpoint to your existing code

app.get('/messages/:receiverId', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;

    const { receiverId } = req.params;

    try {
      // Check if the authenticated user is the recipient of the messages
      if (userData.id !== receiverId) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      // Fetch messages for the given receiverId
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
        {
          email: userDoc.email,
          id: userDoc._id,
        },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;

          // Set SameSite attribute here
          res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'None',  // Set SameSite to 'None'
            secure: true,      // Set secure to true if served over HTTPS
          }).json(userDoc);
        }
      );
    } else {
      res.status(422).json('pass not ok');
    }
  } else {
    res.json('not found');
  }
});


app.get('/profile', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {name,email,_id,balance} = await User.findById(userData.id);
      res.json({name,email,_id,balance});
    });
  } else {
    res.json(null);
  }
});


app.post('/logout', (req,res) => {
  res.cookie('token', '').json(true);
});


app.post('/places', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  const {
    province,from,province2,destination,color,brand,type,seats,price
    ,extraInfo,date,maxGuests,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner:userData.id,price,
      province,from,province2,destination,color,brand,type,seats
      ,extraInfo,date,maxGuests,
    });
    res.json(placeDoc);
  });
});

app.post('/requests', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  const {
    province,from,province2,destination,price
    ,extraInfo,date,NumOfPassengers,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const RequestDoc = await Request.create({
      owner:userData.id,price,
      province,from,province2,destination,
      extraInfo,date,NumOfPassengers,
    });
    res.json(RequestDoc);
  });
});

app.post('/withdrawals', (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

  const { token } = req.cookies;
  const {
    amount, accountNumber, accountName, bankName,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      // Handle JWT verification error
      console.error('JWT Verification Error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    try {
      // Creating a new Withdrawals document
      const withdrawalsDoc = await Withdrawals.create({
        owner: userData.id,
        amount,
        accountNumber,
        accountName,
        bankName,
      });

      res.json(withdrawalsDoc);
    } catch (error) {
      // Handle other errors, e.g., database error
      console.error('Withdrawals Creation Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});
app.get('/user-places', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: 'JWT Token not provided' });
  }

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      console.error('JWT Verification Error:', err);
      return res.status(401).json({ error: 'JWT verification failed' });
    }

    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});


app.get('/requested-trips', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const {id} = userData;
    res.json( await Request.find({owner:id}) );
  });
});

app.get('/places/:id', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {id} = req.params;
  res.json(await Place.findById(id));
});

app.put('/places', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  const {
    id, province,from,province2,destination,color,brand,type,seats,
    extraInfo,date,maxGuests,price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        province,from,province2,destination,color,brand,type,seats,
        extraInfo,date,maxGuests,price,
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
});

app.get('/places', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json( await Place.find() );
});

app.get('/requests/:id', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {id} = req.params;
  res.json(await Request.findById(id));
});

app.put('/requests', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  const {
    id, province,from,province2,destination,
    extraInfo,date,NumOfPassengers,price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const RequestDoc = await Request.findById(id);
    if (userData.id === RequestDoc.owner.toString()) {
      RequestDoc.set({
        province,from,province2,destination,
        extraInfo,date,NumOfPassengers,price,
      });
      await RequestDoc.save();
      res.json('ok');
    }
  });
});

app.get('/requests', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json( await Request.find() );
});


app.post('/bookings', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const {
    place,passengers,name,phone,price,reference,
  } = req.body;
  Booking.create({
    place,passengers,name,phone,price,reference,
    user:userData.id,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
});

app.post('/bookings2', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const {
    request,passengers,name,phone,price,reference,
  } = req.body;
  Booking2.create({
    request,passengers,name,phone,price,reference,
    user:userData.id,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
});


app.get('/bookings', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  res.json( await Booking.find({user:userData.id}).populate('place') );
});

app.get('/bookings2', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  res.json( await Booking2.find({user:userData.id}).populate('request') );
});

app.listen(port, () => {
  console.log(`Server running on PORT ${port}`);
});