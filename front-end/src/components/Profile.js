import { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/user');
        if (response.status === 200) {
          setName(response.data.name);
          setEmail(response.data.email);
          setAge(response.data.age);
          setGender(response.data.gender);
          setDob(response.data.dob);
          setMobile(response.data.mobile);
        }
      } catch (error) {
        console.log(error);
        setError('Error fetching user');
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put('/api/user', { name, email, age, gender, dob, mobile });
      if (response.status === 200) {
        setSuccess(true);
      }
    } catch (error) {
      console.log(error);
      setError('Error updating user');
    }
  };

  return (
    <div>
      <h1>Profile</h1>
      {error && <p>{error}</p>}
      {success && <p>User updated successfully</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Age:
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
        </label>
        <label>
          Gender:
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Date of Birth:
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        </label>
        <label>
          Mobile:
          <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} />
        </label>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default Profile;