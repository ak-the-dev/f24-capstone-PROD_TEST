
# **Centsible**  
Latest Production Deployment Version  
[GitHub Repository](https://github.com/ak-the-dev/f24-capstone-PROD_TEST)

---

## **How to Run**

### **1. Clone the Repository**
```bash
git clone <repository-url>
```

### **2. Navigate to the Root Directory**
```bash
cd <repository-directory>
```

### **3. Configure Environment**
Create a `.env` file in the root directory with the appropriate Firebase keys.

### **4. Install Dependencies**
```bash
npm install
```

---

## **Run Scripts**

The following scripts are defined in `package.json` and can be used for different purposes:

### **Optimized Build**
Runs the application with an optimized production build.
```bash
npm start
```
This executes:
- `react-scripts build` to create an optimized build.
- Serves the application using `concurrently`.

---

### **Development Build**
Runs the application in development mode with live updates and Firebase emulators for authentication and Firestore.
```bash
npm run dev
```
This executes:
- `react-scripts start` for the React frontend.
- `firebase emulators:start --only auth,firestore` for Firebase emulators.

---

### **Frontend Only (Live Updates)**
Starts the React frontend with live updates.
```bash
npm run react
```
This runs:
- `react-scripts start`.

---

### **Static Optimized Build**
Generates a static optimized build of the React app.
```bash
npm run build
```
This executes:
- `react-scripts build`.

---

### **Deploy to GitHub Pages**
Deploys the optimized build to GitHub Pages.
```bash
npm run predeploy
npm run deploy
```
This sequence executes:
1. `npm run build` (via the `predeploy` script) to create an optimized build.
2. `gh-pages -d build` (via the `deploy` script) to deploy the build to GitHub Pages.

---

### **Eject React Scripts (Advanced)**
Ejects the configuration files for customization. Use this only if absolutely necessary, as it is irreversible.
```bash
npm run eject
```
This runs:
- `react-scripts eject`.

---

## **Checklist**

- [x] **Login & Register Page**  
- [x] **Dashboard Page**  
- [x] **Purchase Page**  
- [x] **Paycheck Page**  
- [x] **Goals Page**  
- [x] **Track Spending Page**

---
