# Disease-Detecting-Doctors

## Local Environment Setup

- If you don't have Python installed yet, [click here](https://www.python.org/downloads/). Flask supports versions 3.8+.
- If you don't have npm installed yet, [click here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Follow these steps to set up your local development environment:

### For Linux/macOS

1. **Clone the Repository and Enter the ```venv``` Folder**
   
   ```bash
   git clone https://github.com/bmansour1/Disease-Detecting-Doctors.git
   cd Disease-Detecting-Doctors/backend/venv
   ```
3. **Move app.py and requirements.txt out of ```venv```, Then Delete ```venv```**
   
   ```bash
   mv app.py requirements.txt
   cd ../
   rm -rf venv
   ```
4. **Create and Activate a Python Virtual Environment**
   
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
5. **Install Backend Dependencies**
   
   ```bash
   pip install -r requirements.txt
   ```
7. **Install Frontend Dependencies**
   
   ```bash
   cd ../frontend
   npm install
   ```
9. **Set Up Environment Variables**
    
   ```bash
   echo "VITE_CLERK_PUBLISHABLE_KEY=pk_test_aW50ZXJuYWwtbW90aC02NC5jbGVyay5hY2NvdW50cy5kZXYk" > .env.local
   ```
11. **Configure package.json start script**
- Open the package.json file under the ```src``` folder
- Locate the ```"start"``` script under ```"scripts"```
- Change it to
  ```
  "start": "concurrently \"cd ../backend && source venv/bin/activate && flask run\" \"vite\""
  ```
- Save the change
  
8. **Run the Application**
   
   ```bash
   npm start
   ```
   If you completed step 7 correctly, Vite and Flask should both start up at the same time.
   The frontend (Vite) will be located at
   ```url
   http://localhost/:5173
   ```
   The backend (Flask) will be located at
   ```url
   http://localhost/:5000
   ```

### For Windows

1. **Clone the Repository and Enter the ```venv``` Folder**
   
   ```bash
   git clone https://github.com/bmansour1/Disease-Detecting-Doctors.git
   cd Disease-Detecting-Doctors\backend\venv
   ```
3. **Move app.py and requirements.txt out of ```venv```, Then Delete ```venv```**
   
   ```bash
   move app.py ..\
   move requirements.txt ..\
   cd ..\
   rmdir /s /q venv
   ```
4. **Create and Activate a Python Virtual Environment**
   
   ```bash
   python -m venv venv
   \venv\Scripts\activate
   ```
5. **Install Backend Dependencies**
   
   ```bash
   pip install -r requirements.txt
   ```
7. **Install Frontend Dependencies**
   
   ```bash
   cd ..\frontend
   npm install
   ```
8. **Set Up Environment Variables**
    
   ```bash
   echo "VITE_CLERK_PUBLISHABLE_KEY=pk_test_aW50ZXJuYWwtbW90aC02NC5jbGVyay5hY2NvdW50cy5kZXYk" > .env.local
   ```
  
9. **Run the Application**
   
   ```bash
   npm start
   ```
   Vite and Flask should both start up at the same time.
   The frontend (Vite) will be located at
   ```url
   http://localhost/:5173
   ```
   The backend (Flask) will be located at
   ```url
   http://localhost/:5000
   ```
   
