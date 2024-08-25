import './App.css'; // oder './index.css', je nachdem, wie Ihre Datei heißt
import React, { useState, useEffect } from 'react';
   import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
   import { onAuthStateChanged, signOut } from "firebase/auth";
   import { auth } from './firebase';
   import Learn from './components/Learn';
   import Auth from './components/Auth';
   import ProgressDisplay from './components/ProgressDisplay';

   function App() {
     const [user, setUser] = useState(null);

     useEffect(() => {
       const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
         setUser(currentUser);
       });
       return () => unsubscribe();
     }, []);

     const handleLogout = () => {
       signOut(auth).then(() => {
         setUser(null);
       }).catch((error) => {
         console.error("Logout error", error);
       });
     };

     return (
       <Router>
         <div>
           {!user ? (
             <Auth onLogin={setUser} />
           ) : (
             <>
               <nav>
                 <ul>
                   <li><Link to="/">Home</Link></li>
                   <li><Link to="/learn">Lernen</Link></li>
                   <li><Link to="/progress">Fortschritt</Link></li>
                   <li><button onClick={handleLogout}>Abmelden</button></li>
                 </ul>
               </nav>
               <Routes>
                 <Route path="/learn" element={<Learn />} />
                 <Route path="/progress" element={<ProgressDisplay />} />
                 <Route path="/" element={
                   <>
                     <h1>Willkommen zur Palliative Care Learner App, {user.email}!</h1>
                     <p>Wählen Sie "Lernen" um Fragen zu beantworten oder "Fortschritt" um Ihren Fortschritt zu sehen.</p>
                   </>
                 } />
               </Routes>
             </>
           )}
         </div>
       </Router>
     );
   }

   export default App;
   