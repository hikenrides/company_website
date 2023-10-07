import {Link} from "react-router-dom";
import {useState} from "react";
import axios from "axios";

export default function RegisterPage() {
  const [name,setName] = useState('');
  const [gender, setGender] = useState('');
  const [phone_number, setNumber] = useState('');
  const [age, setAge] = useState('');
  const [email,setEmail] = useState('');
  const [isDriver, setIsDriver] = useState(false);
  const [driverLicense, setDriverLicense] = useState('');
  const [licenseCode, setLicenseCode] = useState('');
  const [password,setPassword] = useState('');
  async function registerUser(ev) {
    ev.preventDefault();
    try {
      await axios.post('/register', {
        name,
        gender,
        phone_number,
        email,
        isDriver,
        driverLicense: isDriver ? driverLicense : '',
        licenseCode: isDriver ? licenseCode : '',
        password,
      });
      alert('Registration successful. Now you can log in');
    } catch (e) {
      console.log('Registration failed. Please try again later');
    }
  }
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input type="text"
                 placeholder="fullname"
                 value={name}
                 onChange={ev => setName(ev.target.value)} />
          <input type="text"
                 placeholder="Gender"
                 value={gender}
                 onChange={ev => setGender(ev.target.value)} />
          <input type="text"
                 placeholder="Phone number"
                 value={phone_number}
                 onChange={ev => setNumber(ev.target.value)} />
          <input type="text"
                 placeholder="Age"
                 value={age}
                 onChange={ev => setAge(ev.target.value)} />
          <input type="email"
                 placeholder="your@email.com"
                 value={email}
                 onChange={ev => setEmail(ev.target.value)} />
          
          <input type="password"
                 placeholder="password"
                 value={password}
                 onChange={ev => setPassword(ev.target.value)} />
                 <input
                 type="checkbox"
                 checked={isDriver}
                 onChange={(ev) => setIsDriver(ev.target.checked)}
            />
          <label htmlFor="isDriver">I'm a driver</label>
          {isDriver && (
  <>
    <input
      type="text"
      placeholder="Driver's License No"
      value={driverLicense}
      onChange={(ev) => setDriverLicense(ev.target.value)}
    />
    <input
      type="text"
      placeholder="License Code"
      value={licenseCode}
      onChange={(ev) => setLicenseCode(ev.target.value)}
    />
  </>
)}

          <button className="primary">Register</button>
          <div className="text-center py-2 text-gray-500">
            Already a member? <Link className="underline text-black" to={'/login'}>Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}