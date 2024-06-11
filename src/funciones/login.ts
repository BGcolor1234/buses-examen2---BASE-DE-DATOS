import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import Swal from "sweetalert2";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBwsYm9TUIwp5jOPv-QOIORV8QIdVEEgM",
  authDomain: "buses-74314.firebaseapp.com",
  databaseURL: "https://buses-74314-default-rtdb.firebaseio.com",
  projectId: "buses-74314",
  storageBucket: "buses-74314.appspot.com",
  messagingSenderId: "805082094385",
  appId: "1:805082094385:web:0802d5e105b7feddce6e10",
  measurementId: "G-G2L6M9JLRM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const coleccionUsuariosRef = ref(db, 'user');

// Function to handle login form submission
document.getElementById('loginForm')?.addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent default form submission

  // Get email and password from the form
  const email = (document.getElementById('email') as HTMLInputElement).value;
  const password = (document.getElementById('password') as HTMLInputElement).value;

  try {
    // Fetch users from the database
    const snapshot = await get(coleccionUsuariosRef);
    const usuarios = snapshot.val();

    // Check if the user exists and the password matches
    let usuarioEncontrado = false;
    if (usuarios) {
      Object.keys(usuarios).forEach((key) => {
        const usuario = usuarios[key];
        if (usuario.email === email && usuario.password === password) {
          usuarioEncontrado = true;
          console.log("Usuario encontrado:", usuario.user);
          console.log("Rol:", usuario.rol);

          // Redirect to buses page
          window.location.href = 'src/Pantallas/buses.html';  // Adjust this line with the correct path

          // Show success alert
          Swal.fire({
            icon: 'success',
            title: 'Signed in successfully!',
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
    }

    // Show error if user not found or password incorrect
    if (!usuarioEncontrado) {
      console.log("Usuario no encontrado o contraseña incorrecta.");
      Swal.fire({
        icon: 'error',
        title: 'Usuario no encontrado o contraseña incorrecta.',
        showConfirmButton: false,
        timer: 1500
      });
    }
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error al consultar la base de datos.',
      showConfirmButton: false,
      timer: 1500
    });
  }
});
