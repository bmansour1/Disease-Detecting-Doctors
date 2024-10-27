import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

export default function InputForm() {
    const [biometrics, setBiometrics] = useState({
        gender: '',
        race: '',
        age: '',
        height: '',
        weight: '',
        bloodPressure: '',
        allergies: '',
        symptoms: ''
    });
    const { user } = useUser();

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setBiometrics({ ...biometrics, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const url = `http://127.0.0.1:5000/api/user/biometrics/set/${user?.id}`;

        try {
            const response = await axios.post(url, biometrics);
            console.log('Server response:', response.data);
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    return (
        <div>
            <h2>Add/Edit Biometrics</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="gender">Gender</label>
                    <input
                        type="text"
                        id="gender"
                        name="gender"
                        value={biometrics.gender}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="race">Race</label>
                    <input
                        type="text"
                        id="race"
                        name="race"
                        value={biometrics.race}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="age">Age</label>
                    <input
                        type="text"
                        id="age"
                        name="age"
                        value={biometrics.age}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="height">Height</label>
                    <input
                        type="text"
                        id="height"
                        name="height"
                        value={biometrics.height}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="weight">Weight</label>
                    <input
                        type="text"
                        id="weight"
                        name="weight"
                        value={biometrics.weight}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="bloodPressure">Blood Pressure</label>
                    <input
                        type="text"
                        id="bloodPressure"
                        name="bloodPressure"
                        value={biometrics.bloodPressure}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="allergies">Allergies</label>
                    <input
                        type="text"
                        id="allergies"
                        name="allergies"
                        value={biometrics.allergies}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="symptoms">Symptoms</label>
                    <input
                        type="text"
                        id="symptoms"
                        name="symptoms"
                        value={biometrics.symptoms}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}